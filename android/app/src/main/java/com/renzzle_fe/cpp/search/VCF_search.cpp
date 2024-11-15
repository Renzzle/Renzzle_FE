#pragma once

#include "../evaluate/evaluator.cpp"
#include "../tree/tree_manager.cpp"
#include "../test/test.cpp"
#include <vector>

class VCFSearch {

    PRIVATE
    TreeManager treeManager;
    Evaluator evaluator;
    Color targetColor;
    bool isWin();
    bool isTargetTurn();

    PUBLIC
    VCFSearch(Board& board);
    bool findVCF();
    MoveList getVCFPath();

};

VCFSearch::VCFSearch(Board& board) : treeManager(board) {
    targetColor = board.isBlackTurn() ? COLOR_BLACK : COLOR_WHITE;
}

int VCFSearch::findVCF() {
    if (isWin()) return 5; // true일 때 5를 반환

    MoveList moves;
    if (isTargetTurn())
        moves = evaluator.getFours(treeManager.getBoard());
    else
        moves = evaluator.getCandidates(treeManager.getBoard());

    if (moves.empty()) return -1; // false일 때 -1을 반환

    for (auto move : moves) {
        if(treeManager.isVisited(move))
            continue;
        treeManager.move(move);
        int result = findVCF();
        if (result == 5) return 5; // 재귀 호출에서 true를 반환하면 5를 반환
        treeManager.undo();
    }

    return -1; // 끝까지 탐색 후에도 조건이 충족되지 않으면 -1을 반환
}

bool VCFSearch::isWin() {
    Result result = treeManager.getBoard().getResult();
    if (result == BLACK_WIN && targetColor == COLOR_BLACK)
        return true;
    if (result == WHITE_WIN && targetColor == COLOR_WHITE)
        return true;
    return false;
}

bool VCFSearch::isTargetTurn() {
    if (treeManager.getBoard().isBlackTurn()) {
        if (targetColor == COLOR_BLACK) return true;
        else return false;
    } else {
        if (targetColor == COLOR_BLACK) return false;
        else return true;
    }
}

MoveList VCFSearch::getVCFPath() {
    return treeManager.getBoard().getPath();
}