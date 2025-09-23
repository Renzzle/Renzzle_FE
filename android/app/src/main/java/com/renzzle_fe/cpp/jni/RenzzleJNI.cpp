#include <string>
#include "search/search_win.h"
#include "search/search.h"
#include "test/util.h"
#include "game/board.h"
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

    Board board = getBoard(boardDataStr);

    SearchMonitor vcfMonitor;
    SearchWin vcfSearcher(board, vcfMonitor);

    double lastTriggerTime = 0.0;
    vcfMonitor.setTrigger([&lastTriggerTime](SearchMonitor& monitor) {
        if (monitor.getElapsedTime() - lastTriggerTime >= 5.0) {
            return true;
        }
        return false;
    });
    vcfMonitor.setSearchListener([&vcfSearcher](SearchMonitor& monitor) {
        vcfSearcher.stop();
    });

    bool result = vcfSearcher.findVCF();
    if (result) {
        int depth = vcfMonitor.getBestPath().size() - board.getPath().size();
        return depth;
    }

    // VCT (Victory by Continuous Three) 검색은 현재 구현되지 않음
    // VCF 검색만 수행

    return -1;
}

// 새로 추가한 메서드
JNIEXPORT jint JNICALL
Java_com_renzzle_1fe_UserAgainstActionJNI_reactUserMove(JNIEnv *env, jobject obj, jstring javaBoardData) {
    // Java String을 C++의 string으로 변환
    const char *nativeBoardData = env->GetStringUTFChars(javaBoardData, 0);
    string boardDataStr(nativeBoardData);
    env->ReleaseStringUTFChars(javaBoardData, nativeBoardData);

    Board board = getBoard(boardDataStr);
    if (board.getResult() != ONGOING) return 1000;

    SearchMonitor monitor;
    Search moveGenerator(board, monitor);
    
    // Run iterative deepening search to find best move
    moveGenerator.ids();
    
    // Get the best move from the search result
    Pos nextMove = moveGenerator.treeManager.getNode()->bestMove;
    if (nextMove.isDefault()) return -1;
    
    int result = (nextMove.getY() - 1) * 15 + nextMove.getX() - 1;
    return result;
}

JNIEXPORT jstring JNICALL
Java_com_renzzle_1fe_PuzzleGenerateJNI_generatePuzzle(JNIEnv *env, jobject obj) {
    PuzzleGenerator generator;
    Board board = generator.generatePuzzle();

    // Convert path to string format
    string puzzleData = "";
    for (const auto& move : board.getPath()) {
        puzzleData += to_string(move.getX()) + "," + to_string(move.getY()) + ";";
    }
    jstring javaString = env->NewStringUTF(puzzleData.c_str());
    return javaString;
}

}
