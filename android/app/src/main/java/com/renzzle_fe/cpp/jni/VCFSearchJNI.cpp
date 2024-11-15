#include <jni.h>
#include "../search/VCF_search.h"
#include "../test/util.h"

extern "C" {

// JNI 메서드: findVCF 메소드를 호출하여 결과를 반환
JNIEXPORT jint JNICALL
Java_com_renzzle_1fe_VCFSearchJNI_findVCF(JNIEnv *env, jobject obj, jstring javaBoardData) {
    // Java String을 C++의 string으로 변환
    const char *nativeBoardData = env->GetStringUTFChars(javaBoardData, 0);
    std::string boardDataStr(nativeBoardData);
    env->ReleaseStringUTFChars(javaBoardData, nativeBoardData);
    Board board = getBoard(boardDataStr);
    SearchMonitor monitor;
    VCFSearch vcfSearcher(board, monitor);

    bool result = vcfSearcher.findVCF();
    int depth = monitor.getBestPath().size() - board.getPath().size();
    if(result) return depth;
    else return -1;
}
}
