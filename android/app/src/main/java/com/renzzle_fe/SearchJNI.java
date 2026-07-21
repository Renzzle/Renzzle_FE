package com.renzzle_fe;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class SearchJNI extends ReactContextBaseJavaModule {

    private static final String VALIDATE_CANCELLED_RESULT = "__CANCELLED__";

    private final Set<Integer> cancelledRequestIds = Collections.synchronizedSet(new HashSet<>());

    static {
        System.loadLibrary("native-lib");
    }

    public SearchJNI(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SearchJNI";
    }

    // JNI에서 호출할 메서드
    public native String findWin(int requestId, String boardData); // C++의 JNI 메서드를 호출하는 Java 메서드

    private native void cancelFindWinNative(int requestId);

    @ReactMethod
    public void findWinWrapper(int requestId, String boardData, Promise promise) {
        JNIExecutor.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    android.os.Trace.beginSection("JNI:findWinWrapper");

                    if (cancelledRequestIds.remove(requestId)) {
                        promise.resolve(createCancelledResponse());
                        return;
                    }

                    String result = findWin(requestId, boardData); // 전달받은 boardData를 네이티브로 전달
                    if (VALIDATE_CANCELLED_RESULT.equals(result) || cancelledRequestIds.remove(requestId)) {
                        promise.resolve(createCancelledResponse());
                        return;
                    }

                    WritableMap response = Arguments.createMap();
                    response.putString("status", "ok");
                    response.putString("result", result);
                    promise.resolve(response);
                } catch (Exception e) {
                    promise.reject("ERROR", "Failed to perform VCF search", e);
                } finally {
                    cancelledRequestIds.remove(requestId);
                    android.os.Trace.endSection();
                }
            }
        });
    }

    @ReactMethod
    public void cancelFindWin(int requestId) {
        cancelledRequestIds.add(requestId);
        cancelFindWinNative(requestId);
    }

    @Override
    public void invalidate() {
        super.invalidate();
        JNIExecutor.shutdownNow();
    }

    private WritableMap createCancelledResponse() {
        WritableMap response = Arguments.createMap();
        response.putString("status", "cancelled");
        return response;
    }
}
