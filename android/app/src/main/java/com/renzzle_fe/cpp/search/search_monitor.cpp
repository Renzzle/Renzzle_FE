#include "search_monitor.h"

SearchMonitor::SearchMonitor() {
    elapsedTime = 0.0;
    bestValue = INITIAL_VALUE;
    depth = 0;
    maxDepth = 0;
    visitCnt = 0;

    trigger = [](SearchMonitor& monitor) { return false; };
    searchListener = [](SearchMonitor& monitor) {};
}

void SearchMonitor::initStartTime() {
    startTime = std::chrono::high_resolution_clock::now();
}

void SearchMonitor::setTrigger(std::function<bool(SearchMonitor&)> newTrigger) {
    trigger = newTrigger;
}

void SearchMonitor::setSearchListener(std::function<void(SearchMonitor&)> newSearchListener) {
    searchListener = newSearchListener;
}

void SearchMonitor::executeTrigger() {
    if (trigger(*this)) {
        searchListener(*this);
    }
}

void SearchMonitor::updateElapsedTime() {
    Timestamp now = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::nanoseconds>(now - startTime);
    elapsedTime = duration.count() / 1e9;
    executeTrigger();
}

void SearchMonitor::incDepth() {
    depth++;
    executeTrigger();
}

void SearchMonitor::decDepth() {
    depth--;
    executeTrigger();
}

void SearchMonitor::incVisitCnt() {
    visitCnt++;
    executeTrigger();
}

void SearchMonitor::updateMaxDepth(int maxDepth) {
    if (this->maxDepth < maxDepth) {
        this->maxDepth = maxDepth;
    }
    executeTrigger();
}

void SearchMonitor::setBestPath(MoveList path) {
    bestPath = path;
    executeTrigger();
}

void SearchMonitor::setBestValue(Value val) {
    bestValue = val;
    executeTrigger();
}

// Getters
double SearchMonitor::getElapsedTime() {
    return elapsedTime;
}

int SearchMonitor::getDepth() {
    return depth;
}

int SearchMonitor::getMaxDepth() {
    return maxDepth;
}

size_t SearchMonitor::getVisitCnt() {
    return visitCnt;
}

MoveList SearchMonitor::getBestPath() {
    return bestPath;
}

Value SearchMonitor::getBestValue() {
    return bestValue;
}
