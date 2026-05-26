package com.renzzle_fe;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class UserAgainstActionJNI extends ReactContextBaseJavaModule {

    private static final int ENGINE_CANCELLED_MOVE = -2;

    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final Set<Integer> cancelledRequestIds = Collections.synchronizedSet(new HashSet<>());

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

    public native int reactUserMove(int requestId, String boardData);

    private native void cancelUserMoveNative(int requestId);

    @ReactMethod
    public void calculateSomethingWrapper(int requestId, String boardData, Promise promise) {
        Log.d("JNI", "calculateSomethingWrapper: requestId=" + requestId + ", boardData=" + boardData);

        executor.execute(() -> {
            try {
                android.os.Trace.beginSection("JNI:calculateSomethingWrapper");

                if (cancelledRequestIds.remove(requestId)) {
                    promise.resolve(createCancelledResponse());
                    return;
                }

                int result = reactUserMove(requestId, boardData);
                if (result == ENGINE_CANCELLED_MOVE || cancelledRequestIds.remove(requestId)) {
                    promise.resolve(createCancelledResponse());
                    return;
                }

                WritableMap response = Arguments.createMap();
                response.putString("status", "ok");
                response.putInt("move", result);
                promise.resolve(response);
            } catch (Exception e) {
                promise.reject("ERROR", "Failed to react user move", e);
            } finally {
                cancelledRequestIds.remove(requestId);
                android.os.Trace.endSection();
            }
        });
    }

    @ReactMethod
    public void cancelCalculate(int requestId) {
        cancelledRequestIds.add(requestId);
        cancelUserMoveNative(requestId);
    }

    @Override
    public void invalidate() {
        executor.shutdownNow();
        super.invalidate();
    }

    private WritableMap createCancelledResponse() {
        WritableMap response = Arguments.createMap();
        response.putString("status", "cancelled");
        return response;
    }
}
