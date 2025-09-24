#include <string>
#include "search/search_win.h"
#include "search/search.h"
#include "test/util.h"
#include "game/board.h"
#include "engine/engine.h"
// #include "generator/puzzle_generator.h"

using namespace std;

// JNI 타입들을 직접 정의 (jni.h 대신)
typedef int jint;
typedef void* jobject;
typedef void* jstring;

// JNIEnv 구조체 정의
struct JNIEnv {
    jstring (*NewStringUTF)(const char*);
    const char* (*GetStringUTFChars)(jstring, int*);
    void (*ReleaseStringUTFChars)(jstring, const char*);
};

// JNI 매크로들을 직접 정의
#define JNIEXPORT
#define JNICALL

extern "C" {

// JNI 메서드: findVCF 메소드를 호출하여 결과를 반환
JNIEXPORT jint JNICALL
Java_com_renzzle_1fe_VCFSearchJNI_findVCF(JNIEnv *env, jobject obj, jstring javaBoardData) {
    // Java String을 C++의 string으로 변환
    const char *nativeBoardData = env->GetStringUTFChars(javaBoardData, 0);
    string boardDataStr(nativeBoardData);
    env->ReleaseStringUTFChars(javaBoardData, nativeBoardData);

    return validatePuzzle(boardDataStr);
}

// 새로 추가한 메서드
JNIEXPORT jint JNICALL
Java_com_renzzle_1fe_UserAgainstActionJNI_reactUserMove(JNIEnv *env, jobject obj, jstring javaBoardData) {
    // Java String을 C++의 string으로 변환
    const char *nativeBoardData = env->GetStringUTFChars(javaBoardData, 0);
    string boardDataStr(nativeBoardData);
    env->ReleaseStringUTFChars(javaBoardData, nativeBoardData);

    int result = findNextMove(boardDataStr);
    return result;
}

JNIEXPORT jstring JNICALL
Java_com_renzzle_1fe_PuzzleGenerateJNI_generatePuzzle(JNIEnv *env, jobject obj) {
    jstring javaString = env->NewStringUTF("");
    return javaString;
}

}
