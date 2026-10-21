package com.renzzle_fe;

import android.os.Process;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

final class JNIExecutor {

    // 화면과 JS가 먼저 CPU를 쓰도록 AI 계산 스레드를 조금 낮춘다.
    private static final int ENGINE_THREAD_PRIORITY = 5;

    private static ExecutorService executorService;

    private JNIExecutor() {
    }

    static synchronized Future<?> submit(Runnable task) {
        if (executorService == null || executorService.isShutdown() || executorService.isTerminated()) {
            executorService = Executors.newSingleThreadExecutor(runnable -> new Thread(() -> {
                Process.setThreadPriority(ENGINE_THREAD_PRIORITY);
                runnable.run();
            }, "renzzle-engine"));
        }

        return executorService.submit(task);
    }

    static synchronized void shutdownNow() {
        if (executorService != null) {
            executorService.shutdownNow();
            executorService = null;
        }
    }
}
