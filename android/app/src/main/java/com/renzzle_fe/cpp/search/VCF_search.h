#pragma once

#include "../evaluate/evaluator.h"
#include "../tree/tree_manager.h"
#include "../test/test.h"
#include "search_monitor.h"

class VCFSearch {

private:
    TreeManager treeManager;
    SearchMonitor& monitor;
    Color targetColor;
    bool isInitTime = false;

    bool isWin();
    bool isTargetTurn();

public:
    VCFSearch(Board& board, SearchMonitor& monitor);
    bool findVCF();
    bool findVCT();
    bool findVCT(int limit);
};
