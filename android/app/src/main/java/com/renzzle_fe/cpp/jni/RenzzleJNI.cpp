#include <jni.h>
#include <memory>
#include <mutex>
#include <string>
#include <unordered_map>
#include "search/search_win.h"
#include "search/search.h"
#include "test/util.h"
#include "game/board.h"
#include "engine/engine.h"

using namespace std;

namespace {
    constexpr const char* VALIDATE_CANCELLED_RESULT = "__CANCELLED__";

    using JobMap = unordered_map<int, shared_ptr<EngineCancelToken>>;

    mutex gFindWinJobsMutex;
    mutex gUserMoveJobsMutex;
    JobMap gFindWinJobs;
    JobMap gUserMoveJobs;

    shared_ptr<EngineCancelToken> startJob(JobMap& jobs, mutex& jobsMutex, int requestId) {
        auto token = make_shared<EngineCancelToken>();
        lock_guard<mutex> lock(jobsMutex);

        auto existing = jobs.find(requestId);
        if (existing != jobs.end()) {
            existing->second->cancel();
        }
        jobs[requestId] = token;
        return token;
    }

    void cancelJob(JobMap& jobs, mutex& jobsMutex, int requestId) {
        lock_guard<mutex> lock(jobsMutex);

        auto existing = jobs.find(requestId);
        if (existing != jobs.end()) {
            existing->second->cancel();
        }
    }

    void finishJob(JobMap& jobs, mutex& jobsMutex, int requestId, const shared_ptr<EngineCancelToken>& token) {
        lock_guard<mutex> lock(jobsMutex);

        auto existing = jobs.find(requestId);
        if (existing != jobs.end() && existing->second == token) {
            jobs.erase(existing);
        }
    }

    string toNativeString(JNIEnv *env, jstring javaString) {
        const char *nativeString = env->GetStringUTFChars(javaString, nullptr);
        if (nativeString == nullptr) {
            return "";
        }

        string result(nativeString);
        env->ReleaseStringUTFChars(javaString, nativeString);
        return result;
    }
}

extern "C" {

// JNI 메서드: findVCF 메소드를 호출하여 결과를 반환
JNIEXPORT jstring JNICALL
Java_com_renzzle_1fe_SearchJNI_findWin(JNIEnv *env, jobject obj, jint requestId, jstring javaBoardData) {
    auto token = startJob(gFindWinJobs, gFindWinJobsMutex, requestId);
    string boardDataStr = toNativeString(env, javaBoardData);

    ValidatePuzzleResult result = validatePuzzleWithResult(boardDataStr, token.get());
    finishJob(gFindWinJobs, gFindWinJobsMutex, requestId, token);

    if (result.cancelled) {
        return env->NewStringUTF(VALIDATE_CANCELLED_RESULT);
    }
    return env->NewStringUTF(result.solution.c_str());
}

JNIEXPORT void JNICALL
Java_com_renzzle_1fe_SearchJNI_cancelFindWinNative(JNIEnv *env, jobject obj, jint requestId) {
    cancelJob(gFindWinJobs, gFindWinJobsMutex, requestId);
}

// 새로 추가한 메서드
JNIEXPORT jint JNICALL
Java_com_renzzle_1fe_UserAgainstActionJNI_reactUserMove(JNIEnv *env, jobject obj, jint requestId, jstring javaBoardData) {
    auto token = startJob(gUserMoveJobs, gUserMoveJobsMutex, requestId);
    string boardDataStr = toNativeString(env, javaBoardData);

    FindNextMoveAnalysis analysis = analyzeNextMove(boardDataStr, token.get());
    finishJob(gUserMoveJobs, gUserMoveJobsMutex, requestId, token);

    return analysis.cancelled ? ENGINE_CANCELLED_MOVE : analysis.move;
}

JNIEXPORT void JNICALL
Java_com_renzzle_1fe_UserAgainstActionJNI_cancelUserMoveNative(JNIEnv *env, jobject obj, jint requestId) {
    cancelJob(gUserMoveJobs, gUserMoveJobsMutex, requestId);
}

JNIEXPORT jint JNICALL
Java_com_renzzle_1fe_CheckWinJNI_checkWin(JNIEnv *env, jobject obj, jstring javaBoardData) {
    string boardDataStr = toNativeString(env, javaBoardData);

    Board board = getBoard(boardDataStr);
    if (board.getResult() == BLACK_WIN) {
        if (board.isBlackTurn()) return 0;
        else return 1;
    } else if (board.getResult() == WHITE_WIN) {
        if (board.isBlackTurn()) return 1;
        else return 0;
    } else {
        return 0;
    }
}

}
