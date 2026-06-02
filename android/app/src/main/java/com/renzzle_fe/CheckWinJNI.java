package com.renzzle_fe;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class CheckWinJNI extends ReactContextBaseJavaModule {

    static {
        System.loadLibrary("native-lib");
    }

    public CheckWinJNI(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "CheckWinJNI";
    }

    public native int checkWin(String boardData);

    @ReactMethod
    public void checkWinWrapper(String boardData, Promise promise) {
        JNIExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    android.os.Trace.beginSection("JNI:checkWinWrapper");
                    int result = checkWin(boardData);

                    if (!Thread.currentThread().isInterrupted()) {
                        promise.resolve(result);
                    }
                } catch (Exception e) {
                    promise.reject("ERROR", "Failed to check win", e);
                } finally {
                    android.os.Trace.endSection();
                }
            }
        });
    }

    @Override
    public void invalidate() {
        super.invalidate();
        JNIExecutor.shutdownNow();
    }

}
