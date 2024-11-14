#include <jni.h>
#include "../search/VCF_search.cpp" // VCFSearch 클래스 포함

extern "C" {

    // JNI 메서드: findVCF 메소드를 호출하여 결과를 반환
    JNIEXPORT jboolean JNICALL
    Java_com_renzzle_fe_VCFSearchJNI_findVCF(JNIEnv *env, jobject obj) {
        // VCFSearch 객체 초기화 (필요시 매개변수 조정)
        Board board; // 가상 Board 객체 초기화 (실제 Board 객체 전달 필요)
        VCFSearch vcfSearch(board);

        // findVCF 메서드 호출
        bool result = vcfSearch.findVCF();
        return result ? JNI_TRUE : JNI_FALSE;
    }
}
