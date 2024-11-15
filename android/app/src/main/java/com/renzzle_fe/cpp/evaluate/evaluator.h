#ifndef EVALUATOR_H
#define EVALUATOR_H

#include "../game/board.h" // 헤더 파일만 include
#include <vector>
#include <tuple>
#include <algorithm>

#define MAX_VALUE 50000
#define MIN_VALUE -50000
#define INITIAL_VALUE -99999

using Score = int;
using Value = int;

class Evaluator {
private:
    Piece self = BLACK;
    Piece oppo = WHITE;

    std::vector<Pos> myFive;
    std::vector<Pos> myMate;
    std::vector<Pos> myFourThree;
    std::vector<Pos> myDoubleThree;

    std::vector<std::tuple<Pos, Score>> myFour;
    std::vector<std::tuple<Pos, Score>> myOpenThree;

    std::vector<Pos> oppoFive;
    std::vector<std::tuple<Pos, Score>> etc;

    std::vector<Pos> oppoMate;
    std::vector<Pos> oppoFourThree;
    std::vector<Pos> oppoDoubleThree;
    std::vector<Pos> oppoForbidden;
    std::vector<Pos> oppoFour;
    std::vector<Pos> oppoOpenThree;
    std::vector<std::tuple<Pos, Score>> myStrategicMove;
    std::vector<std::tuple<Pos, Score>> oppoStrategicMove;

    const Score attackScore[PATTERN_SIZE] = {0, 00, 00, 01, 01, 04, 05, 06, 07, 30, 37, 160, 700, 3000};
    const Score defendScore[PATTERN_SIZE] = {0, 00, 00, 00, 00, 00, 00, 00, 00, 05, 07, 007, 160, 1000};

    void init();
    void classify(Board& board);
    void classify(Board& board, Pos pos);
    Score calculateUtilScore(int myPatternCnt[], int oppoPatternCnt[]);

public:
    std::vector<Pos> getCandidates(Board& board);
    std::vector<Pos> getFours(Board& board);
    Value evaluate(Board& board);
};

#endif // EVALUATOR_H
