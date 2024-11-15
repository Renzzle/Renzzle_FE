#include "cell.h"

// Constructor: Initialize cell with EMPTY piece and NONE patterns
Cell::Cell() {
    this->piece = EMPTY;
    for (Direction dir = DIRECTION_START; dir < DIRECTION_SIZE; dir++) {
        setPattern(BLACK, dir, NONE);
        setPattern(WHITE, dir, NONE);
    }
}

// Get the current piece in the cell
Piece Cell::getPiece() const {
    return piece;
}

// Set the piece in the cell
void Cell::setPiece(const Piece& piece_temp) {
    this->piece = piece_temp;
}

// Get the pattern for a specific piece and direction
Pattern Cell::getPattern(Piece piece_temp, Direction dir) {
    return patterns[piece_temp][dir];
}

// Set the pattern for a specific piece and direction
void Cell::setPattern(Piece piece_temp, Direction dir, Pattern pattern) {
    this->patterns[piece_temp][dir] = pattern;
}
