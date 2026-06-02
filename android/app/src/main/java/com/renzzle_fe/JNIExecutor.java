package com.renzzle_fe;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

final class JNIExecutor {

    private static ExecutorService executorService;

    private JNIExecutor() {
    }

    static synchronized Future<?> submit(Runnable task) {
        if (executorService == null || executorService.isShutdown() || executorService.isTerminated()) {
            executorService = Executors.newSingleThreadExecutor();
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
