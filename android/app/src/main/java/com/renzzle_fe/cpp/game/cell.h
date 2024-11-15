#pragma once

#include "types.h"
#include <cassert>

// Define score type
using Score = int;

// Score tables for attack and defense
const Score attackScore[PATTERN_SIZE] = { 0, 00, 00, 01, 01, 04, 05, 06, 07, 40, 40, 800, 4000, 100000};
const Score defendScore[PATTERN_SIZE] = { 0, 00, 00, 00, 00, 02, 02, 02, 02, 10, 10, 10,   160, 20000};

class Cell {
private:
    Piece piece;
    Pattern patterns[2][DIRECTION_SIZE];
    CompositePattern cPattern[2];
    Score score[2];

public:
    Cell();
    Piece getPiece() const;
    void setPiece(const Piece& piece);
    Pattern getPattern(Piece piece, Direction dir);
    CompositePattern getCompositePattern(Piece piece);
    Score getScore(Piece piece);
    void setPattern(Piece piece, Direction dir, Pattern pattern);
    void clearCompositePattern();
    void setCompositePattern();
    void setScore();
};
