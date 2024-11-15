#pragma once

#include "../game/board.h"
#include "../tree/tree_manager.h"
#include "../test/test.h"
#include <chrono>
#include <functional>

using Timestamp = std::chrono::time_point<std::chrono::high_resolution_clock>;

class SearchMonitor {

private:
    Timestamp startTime;
    double elapsedTime;
    MoveList bestPath;
    Value bestValue;
    int depth;
    int maxDepth;
    size_t visitCnt;
    std::function<bool(SearchMonitor&)> trigger;
    std::function<void(SearchMonitor&)> searchListener;

public:
    SearchMonitor();

    void initStartTime();
    void setTrigger(std::function<bool(SearchMonitor&)> newTrigger);
    void setSearchListener(std::function<void(SearchMonitor&)> newSearchListener);
    void executeTrigger();

    // Update data functions, executes trigger function
    void updateElapsedTime();
    void incDepth();
    void decDepth();
    void incVisitCnt();
    void updateMaxDepth(int maxDepth);
    void setBestPath(MoveList path);
    void setBestValue(Value val);

    // Getters
    double getElapsedTime();
    int getDepth();
    int getMaxDepth();
    size_t getVisitCnt();
    MoveList getBestPath();
    Value getBestValue();
};
