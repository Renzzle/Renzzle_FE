#pragma once

#include "line.h"
#include "pos.h"
#include "zobrist.h"
#include "../test/test.h"
#include <array>
#include <vector>

#define BOARD_SIZE 15
#define STATIC_WALL &cells[0][0]

using namespace std;
using CellArray = array<array<Cell, BOARD_SIZE + 2>, BOARD_SIZE + 2>;
using MoveList = vector<Pos>;

class Board {
private:
    CellArray cells;
    MoveList path;
    Result result;
    size_t currentHash;

    void clearPattern(Cell& cell);
    void setPatterns(Pos& p);
    void setResult(Pos& p);
    Line getLine(Pos& p);
    Pattern getPattern(Line& line, Color color);

public:
    Board();
    bool isBlackTurn();
    CellArray& getBoardStatus();
    Cell& getCell(const Pos p);
    bool move(Pos p);
    void undo();
    Result getResult();
    bool isForbidden(Pos p);
    MoveList getPath();
    size_t getCurrentHash() const;
};
