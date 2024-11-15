#include <jni.h>
#include "../search/VCF_search.cpp" // VCFSearch 클래스 포함

extern "C" {

// JNI 메서드: findVCF 메소드를 호출하여 결과를 반환
JNIEXPORT jint JNICALL
Java_com_renzzle_1fe_VCFSearchJNI_findVCF(JNIEnv *env, jobject obj, jstring javaBoardData) {
    // Java String을 C++의 string으로 변환
    const char *nativeBoardData = env->GetStringUTFChars(javaBoardData, 0);
    std::string boardDataStr(nativeBoardData);
    env->ReleaseStringUTFChars(javaBoardData, nativeBoardData);

    // 문자열 데이터를 이용해 Board 객체 초기화
    Board board = getBoard(boardDataStr);

    VCFSearch vcfSearch(board);

    // findVCF 메서드 호출
    int result = vcfSearch.findVCF();
    return result; // int형으로 5 또는 -1 반환
}
}
