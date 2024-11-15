#pragma once

#include "types.h"
#include <cassert>

// Class representing a single cell in the board
class Cell {
private:
    Piece piece; // Current piece in the cell (e.g., EMPTY, BLACK, WHITE)
    Pattern patterns[2][DIRECTION_SIZE]; // Patterns for both players in all directions

public:
    Cell(); // Constructor
    Piece getPiece() const; // Get the current piece in the cell
    void setPiece(const Piece& piece); // Set the piece in the cell
    Pattern getPattern(Piece piece, Direction dir); // Get the pattern for a specific piece and direction
    void setPattern(Piece piece, Direction dir, Pattern pattern); // Set the pattern for a specific piece and direction
};
