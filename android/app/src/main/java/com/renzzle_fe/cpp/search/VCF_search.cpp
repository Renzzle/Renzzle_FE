#include "VCF_search.h"

VCFSearch::VCFSearch(Board& board, SearchMonitor& monitor) : treeManager(board), monitor(monitor) {
    targetColor = board.isBlackTurn() ? COLOR_BLACK : COLOR_WHITE;
}

bool VCFSearch::findVCF() {
    if (!isInitTime) {
        monitor.initStartTime();
        isInitTime = true;
    }
    monitor.incVisitCnt();
    monitor.updateElapsedTime();
    if (isWin()) return true;
    if (treeManager.getBoard().getResult() != ONGOING) return false;

    // find candidates
    Evaluator evaluator(treeManager.getBoard());
    MoveList moves;

    if (isTargetTurn())
        moves = evaluator.getFours();
    else
        moves = evaluator.getCandidates();

    // dfs
    for (auto move : moves) {
        shared_ptr<Node> childNode = treeManager.getChildNode(move);
        if (childNode != nullptr) { // child node exist
            Result targetResult = (targetColor == COLOR_BLACK) ? BLACK_WIN : WHITE_WIN;
            // prune except win path
            if (childNode->result != targetResult) continue;
        } else {
            // if a winning path exists, skip searching other nodes
            if (treeManager.getNode()->result != ONGOING) continue;
        }

        treeManager.move(move);

        if (findVCF()) {
            // if find vcf, update parent node result
            Result result = treeManager.getNode()->result;
            treeManager.undo();
            treeManager.getNode()->result = result;
            return true;
        }

        treeManager.undo();
    }

    return false;
}

bool VCFSearch::findVCT(int limit) {
    monitor.incVisitCnt();
    monitor.updateElapsedTime();

    // ending condition
    if (isWin()) return true;
    if (limit == 0) return false;
    if (treeManager.getBoard().getResult() != ONGOING) return false;

    Evaluator evaluator(treeManager.getBoard());
    // if there is no threat, return false
    if (isTargetTurn() && evaluator.getThreats().empty()) return false;
    MoveList moves;

    // if only move, just move
    Pos sureMove = evaluator.getSureMove();
    if (!sureMove.isDefault()) {
        treeManager.move(sureMove);
        bool result = findVCT(limit - 1);
        treeManager.undo();
        return result;
    }

    if (isTargetTurn()) {
        moves = evaluator.getThreats();
        for (auto move : moves) {
            treeManager.move(move);
            if (findVCT(limit - 1)) {
                treeManager.undo();
                return true;
            }
            treeManager.undo();
        }
        return false;
    } else {
        if (!evaluator.isOppoMateExist()) return false;
        SearchMonitor vcfMonitor;
        VCFSearch vcfSearch(treeManager.getBoard(), vcfMonitor);
        if (vcfSearch.findVCF()) return false;

        MoveList defend = evaluator.getThreatDefend();
        moves.insert(moves.end(), defend.begin(), defend.end());
        MoveList fours = evaluator.getFours();
        moves.insert(moves.end(), fours.begin(), fours.end());

        for (auto move : moves) {
            treeManager.move(move);
            if (!findVCT(limit - 1)) {
                treeManager.undo();
                return false;
            }
            treeManager.undo();
        }
        return true;
    }
}

bool VCFSearch::findVCT() {
    if (!isInitTime) {
        monitor.initStartTime();
        isInitTime = true;
    }

    for (int i = 3; i <= 11; i += 2) {
        if (findVCT(i)) return true;
    }

    return false;
}

bool VCFSearch::isWin() {
    Result result = treeManager.getBoard().getResult();
    bool isWin = false;

    if (result == BLACK_WIN && targetColor == COLOR_BLACK)
        isWin = true;
    if (result == WHITE_WIN && targetColor == COLOR_WHITE)
        isWin = true;

    // if win, update current node result & set vcf path
    if (isWin) {
        treeManager.getNode()->result = result;
        monitor.setBestPath(treeManager.getNode()->board.getPath());
    }

    return isWin;
}

bool VCFSearch::isTargetTurn() {
    if (treeManager.getBoard().isBlackTurn()) {
        return targetColor == COLOR_BLACK;
    } else {
        return targetColor == COLOR_WHITE;
    }
}
