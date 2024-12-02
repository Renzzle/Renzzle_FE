#include <jni.h>
#include "../search/search_win.h"
#include "../search/search.h"
#include "../test/util.h"
#include "../game/board.h"
#include "../generator/puzzle_generator.h"

extern "C" {

// JNI 메서드: findVCF 메소드를 호출하여 결과를 반환
JNIEXPORT jint JNICALL
Java_com_renzzle_1fe_VCFSearchJNI_findVCF(JNIEnv *env, jobject obj, jstring javaBoardData) {

    // Java String을 C++의 string으로 변환
    const char *nativeBoardData = env->GetStringUTFChars(javaBoardData, 0);
    std::string boardDataStr(nativeBoardData);
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

    SearchMonitor vctMonitor;
    SearchWin vctSearcher(board, vctMonitor);

    lastTriggerTime = 0.0;
    vctMonitor.setTrigger([&lastTriggerTime](SearchMonitor& monitor) {
        if (monitor.getElapsedTime() - lastTriggerTime >= 10.0) {
            return true;
        }
        return false;
    });
    vctMonitor.setSearchListener([&vctSearcher](SearchMonitor& monitor) {
        vctSearcher.stop();
    });

    result = vctSearcher.findVCT();
    if (result) {
        int depth = vctMonitor.getBestPath().size() - board.getPath().size();
        return depth;
    }

    return -1;
}

// 새로 추가한 메서드
JNIEXPORT jint JNICALL
Java_com_renzzle_1fe_UserAgainstActionJNI_reactUserMove(JNIEnv *env, jobject obj, jstring javaBoardData) {
    // Java String을 C++의 string으로 변환
    const char *nativeBoardData = env->GetStringUTFChars(javaBoardData, 0);
    std::string boardDataStr(nativeBoardData);
    env->ReleaseStringUTFChars(javaBoardData, nativeBoardData);

    Board board = getBoard(boardDataStr);
    if (board.getResult() != ONGOING) return 1000;

    SearchMonitor monitor;
    Search moveGenerator(board, monitor);

    Pos nextMove = moveGenerator.findNextMove(board);
    if (nextMove.isDefault()) return -1;
    board.move(nextMove);
    if (board.getResult() != ONGOING) return -1;
    int result = (nextMove.getY() - 1) * 15 + nextMove.getX() - 1;
    return result;
}

JNIEXPORT jstring JNICALL
Java_com_renzzle_1fe_PuzzleGenerateJNI_generatePuzzle(JNIEnv *env, jobject obj) {
    PuzzleGenerator generator;
    Board board = generator.generatePuzzle();

    string puzzleData = pathToString(board.getPath());
    jstring javaString = env->NewStringUTF(puzzleData.c_str());
    return javaString;
}

}