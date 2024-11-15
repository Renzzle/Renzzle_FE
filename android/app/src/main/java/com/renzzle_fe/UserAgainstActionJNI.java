package com.renzzle_fe;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class UserAgainstActionJNI extends ReactContextBaseJavaModule {

    static {
        System.loadLibrary("native-lib");
    }

    public UserAgainstActionJNI(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "UserAgainstActionJNI";
    }

    public native int reactUserMove(String boardData);

    @ReactMethod
    public void calculateSomethingWrapper(String boardData, Promise promise) {
        try {
            int result = reactUserMove(boardData); // 전달받은 값을 네이티브로 전달
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to react user move", e);
        }
    }

}
