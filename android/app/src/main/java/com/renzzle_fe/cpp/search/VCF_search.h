#pragma once

#include "../evaluate/evaluator.h"
#include "../tree/tree_manager.h"
#include "../test/test.h"
#include <vector>

class VCFSearch {
private:
    TreeManager treeManager;
    Evaluator evaluator;
    Color targetColor;

    bool isWin();
    bool isTargetTurn();

public:
    VCFSearch(Board& board);
    int findVCF();
    MoveList getVCFPath();
};
