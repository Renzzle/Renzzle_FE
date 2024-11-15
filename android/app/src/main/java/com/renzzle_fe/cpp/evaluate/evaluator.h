#pragma once

#include "../game/board.h"
#include <vector>
#include <algorithm>
#include <tuple>

#define MAX_VALUE 50000
#define MIN_VALUE -50000
#define INITIAL_VALUE -99999

// for sort positions value
using Score = int;
// evaluate value
using Value = int;

class Evaluator {

private:
    Board& board;
    Piece self = BLACK;
    Piece oppo = WHITE;

    MoveList patternMap[2][COMPOSITE_PATTERN_SIZE];

    void classify();

public:
    Evaluator(Board& board);
    MoveList getCandidates();
    Pos getSureMove();
    MoveList getFours();
    MoveList getThreats();
    MoveList getThreatDefend();
    bool isOppoMateExist();
    Value evaluate();
};
