#include "evaluator.h"

Evaluator::Evaluator(Board& board) : board(board) {
    classify();
}

void Evaluator::classify() {
    if (board.getResult() != ONGOING) return;

    self = board.isBlackTurn() ? BLACK : WHITE;
    oppo = !board.isBlackTurn() ? BLACK : WHITE;

    for (int i = 1; i <= BOARD_SIZE; i++) {
        for (int j = 1; j <= BOARD_SIZE; j++) {
            Pos p = Pos(i, j);
            Cell& c = board.getCell(p);
            if (c.getPiece() == EMPTY) {
                patternMap[BLACK][c.getCompositePattern(BLACK)].push_back(p);
                patternMap[WHITE][c.getCompositePattern(WHITE)].push_back(p);
            }
        }
    }
}

MoveList Evaluator::getCandidates() {
    MoveList result;
    if (!patternMap[self][WINNING].empty()) {
        result.push_back(patternMap[self][WINNING].front());
        return result;
    }
    if (!patternMap[oppo][WINNING].empty()) {
        result.push_back(patternMap[oppo][WINNING].front());
        return result;
    }
    if (!patternMap[self][MATE].empty()) {
        result.push_back(patternMap[self][MATE].front());
        return result;
    }

    result.insert(result.end(), patternMap[self][B4_F3].begin(), patternMap[self][B4_F3].end());
    result.insert(result.end(), patternMap[oppo][MATE].begin(), patternMap[oppo][MATE].end());
    result.insert(result.end(), patternMap[self][F3_2X].begin(), patternMap[self][F3_2X].end());
    result.insert(result.end(), patternMap[self][B4_PLUS].begin(), patternMap[self][B4_PLUS].end());
    result.insert(result.end(), patternMap[self][B4_ANY].begin(), patternMap[self][B4_ANY].end());
    result.insert(result.end(), patternMap[self][F3_PLUS].begin(), patternMap[self][F3_PLUS].end());
    result.insert(result.end(), patternMap[self][F3_ANY].begin(), patternMap[self][F3_ANY].end());
    result.insert(result.end(), patternMap[self][B3_PLUS].begin(), patternMap[self][B3_PLUS].end());
    result.insert(result.end(), patternMap[self][F2_2X].begin(), patternMap[self][F2_2X].end());
    result.insert(result.end(), patternMap[self][B3_ANY].begin(), patternMap[self][B3_ANY].end());
    result.insert(result.end(), patternMap[self][F2_ANY].begin(), patternMap[self][F2_ANY].end());
    sort(result.begin(), result.end(), [&](const Pos& a, const Pos& b) {
        return board.getCell(a).getScore(self) > board.getCell(b).getScore(self);
    });

    return result;
}

Pos Evaluator::getSureMove() {
    if (!patternMap[self][WINNING].empty()) {
        return patternMap[self][WINNING].front();
    }
    if (!patternMap[oppo][WINNING].empty()) {
        return patternMap[oppo][WINNING].front();
    }
    if (!patternMap[self][MATE].empty()) {
        return patternMap[self][MATE].front();
    }

    return Pos();
}

MoveList Evaluator::getFours() {
    MoveList result;
    if (!patternMap[self][WINNING].empty()) {
        result.push_back(patternMap[self][WINNING].front());
        return result;
    }
    if (!patternMap[self][MATE].empty()) {
        result.push_back(patternMap[self][MATE].front());
        return result;
    }
    if (!patternMap[self][B4_F3].empty()) {
        result.insert(result.end(), patternMap[self][B4_F3].begin(), patternMap[self][B4_F3].end());
    }
    if (!patternMap[self][B4_PLUS].empty()) {
        result.insert(result.end(), patternMap[self][B4_PLUS].begin(), patternMap[self][B4_PLUS].end());
    }
    if (!patternMap[self][B4_ANY].empty()) {
        result.insert(result.end(), patternMap[self][B4_ANY].begin(), patternMap[self][B4_ANY].end());
    }
    sort(result.begin(), result.end(), [&](const Pos& a, const Pos& b) {
        return board.getCell(a).getScore(self) > board.getCell(b).getScore(self);
    });

    return result;
}

MoveList Evaluator::getThreats() {
    MoveList result;
    if (!patternMap[self][WINNING].empty()) {
        result.push_back(patternMap[self][WINNING].front());
        return result;
    }
    if (!patternMap[self][MATE].empty()) {
        result.push_back(patternMap[self][MATE].front());
        return result;
    }
    if (!patternMap[self][B4_F3].empty()) {
        result.insert(result.end(), patternMap[self][B4_F3].begin(), patternMap[self][B4_F3].end());
    }
    if (!patternMap[self][F3_2X].empty()) {
        result.insert(result.end(), patternMap[self][F3_2X].begin(), patternMap[self][F3_2X].end());
    }
    if (!patternMap[self][F3_PLUS].empty()) {
        result.insert(result.end(), patternMap[self][F3_PLUS].begin(), patternMap[self][F3_PLUS].end());
    }
    if (!patternMap[self][F3_ANY].empty()) {
        result.insert(result.end(), patternMap[self][F3_ANY].begin(), patternMap[self][F3_ANY].end());
    }
    if (!patternMap[self][B4_PLUS].empty()) {
        result.insert(result.end(), patternMap[self][B4_PLUS].begin(), patternMap[self][B4_PLUS].end());
    }
    if (!patternMap[self][B4_ANY].empty()) {
        result.insert(result.end(), patternMap[self][B4_ANY].begin(), patternMap[self][B4_ANY].end());
    }

    return result;
}

MoveList Evaluator::getThreatDefend() {
    MoveList result;
    if (!patternMap[oppo][WINNING].empty()) {
        result.push_back(patternMap[oppo][WINNING].front());
        return result;
    }

    result.insert(result.end(), patternMap[oppo][MATE].begin(), patternMap[oppo][MATE].end());
    return result;
}

bool Evaluator::isOppoMateExist() {
    if (!patternMap[oppo][WINNING].empty()) return true;
    if (!patternMap[oppo][MATE].empty()) return true;
    return false;
}

Value Evaluator::evaluate() {
    // Evaluate logic
    // case 1: game over
    Result result = board.getResult();
    if (result != ONGOING) {
        if (result == DRAW) return 0;
        return (result == (self == BLACK ? BLACK_WIN : WHITE_WIN)) ? MAX_VALUE : MIN_VALUE;
    }
    return 0; // Simplified for brevity
}
