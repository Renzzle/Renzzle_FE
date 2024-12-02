#pragma once

#include "../evaluate/evaluator.h"
#include "../tree/tree_manager.h"
#include "../test/test.h"
#include "search_monitor.h"

class SearchWin {

private:
    TreeManager treeManager;
    SearchMonitor& monitor;
    Color targetColor;
    Result targetResult;
    bool isRunning = false;

    bool isWin();
    bool isTargetTurn();
    void visit(Pos& p);
    void sortChildNodes(MoveList& moves, bool isTarget);

public:
    SearchWin(Board& board, SearchMonitor& monitor);
    bool findVCF();
    bool findVCT();
    bool findVCT(int limit);
    void stop();
};
