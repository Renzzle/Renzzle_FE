package com.renzzle_fe;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class PuzzleGenerateJNI extends ReactContextBaseJavaModule {

    static {
        System.loadLibrary("native-lib");
    }

    public PuzzleGenerateJNI(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PuzzleGenerateJNI";
    }

    public native String generatePuzzle();

    @ReactMethod
    public void generatePuzzleWrapper(Promise promise) {
        try {
            String result = generatePuzzle();
            if (result == null) result = "h8";
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to react user move", e);
        }
    }

}
