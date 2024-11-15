package com.renzzle_fe;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class VCFSearchJNI extends ReactContextBaseJavaModule {

    static {
        System.loadLibrary("native-lib");
    }

    public VCFSearchJNI(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "VCFSearchJNI";
    }

    // JNI에서 호출할 메서드
    public native int findVCF(String boardData); // C++의 JNI 메서드를 호출하는 Java 메서드

    @ReactMethod
    public void findVCFWrapper(String boardData, Promise promise) {
        try {
            int result = findVCF(boardData); // 전달받은 boardData를 네이티브로 전달
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to perform VCF search", e);
        }
    }
}
