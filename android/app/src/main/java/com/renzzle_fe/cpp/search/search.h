#pragma once

#include "../evaluate/evaluator.h"
#include "../tree/tree_manager.h"
#include "../test/test.h"
#include "search_win.h"
#include "search_monitor.h"
#include <limits>

class Search {

private:
    TreeManager treeManager;
    Color targetColor;
    SearchMonitor& monitor;

    Value alphaBeta(Board& board, int depth, int alpha, int beta, bool maximizingPlayer);
    int ids(Board& board, int depthLimit);
    bool isGameOver(Board& board);
    bool isTargetTurn();

public:
    Search(Board& board, SearchMonitor& monitor);
    Pos findBestMove();
    Pos iterativeDeepeningSearch();
    Pos findNextMove(Board board);
    MoveList getPath();
    MoveList getSimulatedPath();
};
