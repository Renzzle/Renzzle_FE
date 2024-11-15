#include "line.h"

// Constructor: Initialize deadCell as WALL
Line::Line() {
    deadCell.setPiece(WALL);
}

// Index operator implementation
Cell*& Line::operator[](size_t idx) {
    return this->cells[idx];
}

// Count properties of the line
tuple<int, int, int, int> Line::countLine() {
    constexpr auto mid = LINE_LENGTH / 2;

    int realLen = 1, fullLen = 1;
    int realLenInc = 1;
    int start = mid, end = mid;

    int self = cells[mid]->getPiece();
    int oppo = !self;
    Piece piece;

    for (int i = mid - 1; i >= 0; i--) {
        piece = cells[i]->getPiece();
        if (piece == self)
            realLen += realLenInc;
        else if (piece == oppo || piece == WALL)
            break;
        else
            realLenInc = 0;

        fullLen++;
        start = i;
    }

    realLenInc = 1;

    for (int i = mid + 1; i < LINE_LENGTH; i++) {
        piece = cells[i]->getPiece();
        if (piece == self)
            realLen += realLenInc;
        else if (piece == oppo || piece == WALL)
            break;
        else
            realLenInc = 0;

        fullLen++;
        end = i;
    }

    return make_tuple(realLen, fullLen, start, end);
}

// Shift the line to a new position
Line Line::shiftLine(Line& line, int n) {
    constexpr auto len = LINE_LENGTH;

    Line shiftedLine;
    for (int i = 0; i < len; i++) {
        int idx = i + n - len / 2;
        shiftedLine[i] = idx >= 0 && idx < len ? line[idx] : &deadCell;
    }
    return shiftedLine;
}
