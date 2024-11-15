#include "evaluator.h"

void Evaluator::init() {
    myFive.clear();
    myMate.clear();
    myFourThree.clear();
    myDoubleThree.clear();
    myFour.clear();
    myOpenThree.clear();
    oppoFive.clear();
    etc.clear();
    oppoMate.clear();
    oppoFourThree.clear();
    oppoDoubleThree.clear();
    oppoForbidden.clear();
    oppoFour.clear();
    oppoOpenThree.clear();
    myStrategicMove.clear();
    oppoStrategicMove.clear();
}

void Evaluator::classify(Board& board) {
    init();
    if (board.getResult() != ONGOING) return;

    self = board.isBlackTurn() ? BLACK : WHITE;
    oppo = !board.isBlackTurn() ? BLACK : WHITE;

    for (int i = 1; i <= BOARD_SIZE; i++) {
        for (int j = 1; j <= BOARD_SIZE; j++) {
            if (board.getCell(Pos(i, j)).getPiece() == EMPTY)
                classify(board, Pos(i, j));
        }
    }
}

void Evaluator::classify(Board& board, Pos pos) {
    int myPatternCnt[PATTERN_SIZE] = {0};
    int oppoPatternCnt[PATTERN_SIZE] = {0};

    for (Direction dir = DIRECTION_START; dir < DIRECTION_SIZE; dir++) {
        Pattern p = board.getCell(pos).getPattern(self, dir);
        myPatternCnt[p]++;
        p = board.getCell(pos).getPattern(oppo, dir);
        oppoPatternCnt[p]++;
    }

    if (myPatternCnt[FIVE] > 0) {
        myFive.push_back(pos);
    } else if (oppoPatternCnt[FIVE] > 0) {
        oppoFive.push_back(pos);
    }

    if (self == BLACK && board.isForbidden(pos)) return;

    if (myPatternCnt[FREE_4] > 0 || myPatternCnt[BLOCKED_4] >= 2) {
        myMate.push_back(pos);
    } else if (myPatternCnt[BLOCKED_4] > 0 && myPatternCnt[FREE_3] + myPatternCnt[FREE_3A] > 0) {
        myFourThree.push_back(pos);
    } else if (myPatternCnt[FREE_3] + myPatternCnt[FREE_3A] >= 2) {
        myDoubleThree.push_back(pos);
    } else if (myPatternCnt[BLOCKED_4] == 1) {
        Score score = calculateUtilScore(myPatternCnt, oppoPatternCnt);
        myFour.push_back(std::make_tuple(pos, score));
    } else if (myPatternCnt[FREE_3] + myPatternCnt[FREE_3A] == 1) {
        Score score = calculateUtilScore(myPatternCnt, oppoPatternCnt);
        myOpenThree.push_back(std::make_tuple(pos, score));
    } else {
        Score score = calculateUtilScore(myPatternCnt, oppoPatternCnt);
        etc.push_back(std::make_tuple(pos, score));
    }

    Score connectionsScore = myPatternCnt[FREE_2] + myPatternCnt[FREE_2A] + myPatternCnt[FREE_2B] + myPatternCnt[BLOCKED_3];
    if (connectionsScore > 0) {
        myStrategicMove.push_back(std::make_tuple(pos, connectionsScore));
    }

    if (self == WHITE && board.isForbidden(pos)) {
        oppoForbidden.push_back(pos);
        return;
    }
    if (oppoPatternCnt[FREE_4] > 0 || oppoPatternCnt[BLOCKED_4] >= 2) {
        oppoMate.push_back(pos);
    } else if (oppoPatternCnt[BLOCKED_4] > 0 && oppoPatternCnt[FREE_3] + oppoPatternCnt[FREE_3A] > 0) {
        oppoFourThree.push_back(pos);
    } else if (oppoPatternCnt[FREE_3] + oppoPatternCnt[FREE_3A] >= 2) {
        oppoDoubleThree.push_back(pos);
    } else if (oppoPatternCnt[FREE_3] + oppoPatternCnt[FREE_3A] > 0) {
        oppoOpenThree.push_back(pos);
    }

    if (oppoPatternCnt[BLOCKED_4] + oppoPatternCnt[FREE_4] > 0) {
        oppoFour.push_back(pos);
    }

    connectionsScore = oppoPatternCnt[FREE_2] + oppoPatternCnt[FREE_2A] + oppoPatternCnt[FREE_2B] + oppoPatternCnt[BLOCKED_3];
    if (connectionsScore > 0) {
        oppoStrategicMove.push_back(std::make_tuple(pos, connectionsScore));
    }
}

Score Evaluator::calculateUtilScore(int myPatternCnt[], int oppoPatternCnt[]) {
    Score s = 0;
    for (int i = 0; i < PATTERN_SIZE; i++) {
        if (i < FREE_3)
            s += myPatternCnt[i] * attackScore[i];
        s += oppoPatternCnt[i] * defendScore[i];
    }
    return s;
}

std::vector<Pos> Evaluator::getCandidates(Board& board) {
    classify(board);

    std::vector<Pos> result;
    if (!myFive.empty()) {
        result.push_back(myFive.front());
        return result;
    }
    if (!oppoFive.empty()) {
        result.push_back(oppoFive.front());
        return result;
    }
    if (!myMate.empty()) {
        result.push_back(myMate.front());
        return result;
    }

    if (!myFourThree.empty()) {
        result.insert(result.end(), myFourThree.begin(), myFourThree.end());
    }
    if (!oppoMate.empty()) {
        result.insert(result.end(), oppoMate.begin(), oppoMate.end());
    }
    if (!myDoubleThree.empty()) {
        result.insert(result.end(), myDoubleThree.begin(), myDoubleThree.end());
    }

    std::vector<std::tuple<Pos, Score>> attacks;
    if (!myFour.empty()) {
        attacks.insert(attacks.end(), myFour.begin(), myFour.end());
    }
    if (!myOpenThree.empty()) {
        attacks.insert(attacks.end(), myOpenThree.begin(), myOpenThree.end());
    }
    std::sort(attacks.begin(), attacks.end(), [](const std::tuple<Pos, Score>& a, const std::tuple<Pos, Score>& b) {
        return std::get<1>(a) > std::get<1>(b);
    });
    for (const auto& attack : attacks) {
        result.push_back(std::get<0>(attack));
    }

    if (!etc.empty()) {
        std::sort(etc.begin(), etc.end(), [](const std::tuple<Pos, Score>& a, const std::tuple<Pos, Score>& b) {
            return std::get<1>(a) > std::get<1>(b);
        });
        for (const auto& e : etc) {
            result.push_back(std::get<0>(e));
        }
    }
    return result;
}

std::vector<Pos> Evaluator::getFours(Board& board) {
    classify(board);

    std::vector<Pos> result;
    if (!myFive.empty()) {
        result.push_back(myFive.front());
        return result;
    }
    if (!myMate.empty()) {
        result.push_back(myMate.front());
        return result;
    }
    if (!myFourThree.empty()) {
        result.insert(result.end(), myFourThree.begin(), myFourThree.end());
    }
    std::sort(myFour.begin(), myFour.end(), [](const std::tuple<Pos, Score>& a, const std::tuple<Pos, Score>& b) {
        return std::get<1>(a) > std::get<1>(b);
    });
    if (!myFour.empty()) {
        for (const auto& four : myFour) {
            result.push_back(std::get<0>(four));
        }
    }

    return result;
}

Value Evaluator::evaluate(Board& board) {
    classify(board);

    Result result = board.getResult();
    if (result != ONGOING) {
        if (result == DRAW) return 0;
        if (self == BLACK && result == BLACK_WIN)
            return MAX_VALUE;
        if (self == BLACK && result == WHITE_WIN)
            return MIN_VALUE;
        if (self == WHITE && result == BLACK_WIN)
            return MIN_VALUE;
        if (self == WHITE && result == WHITE_WIN)
            return MAX_VALUE;
    }

    if (!myFive.empty()) {
        return MAX_VALUE - 1;
    }
    if (!oppoFive.empty()) {
        return MIN_VALUE + 1;
    }
    if (!myMate.empty()) {
        return MAX_VALUE - 3;
    }
    if (!oppoMate.empty()) {
        return MIN_VALUE + 3;
    }
    if (oppoFour.empty() && (!myFourThree.empty() || !myDoubleThree.empty())) {
        return MAX_VALUE - 5;
    }
    if (myFour.empty() && myFourThree.empty() && (!oppoFourThree.empty() || !oppoDoubleThree.empty())) {
        return MIN_VALUE + 5;
    }

    int val = 0;
    val += myFour.size() * 10;
    val += myFourThree.size() * 10;
    val += myOpenThree.size() * 10;
    val -= oppoFour.size() * 5;
    val -= oppoOpenThree.size() * 5;

    for (auto move : myStrategicMove) {
        val += std::get<1>(move);
    }
    for (auto move : oppoStrategicMove) {
        val -= std::get<1>(move);
    }

    return val;
}
