#pragma once

#include "cell.h"
#include <array>
#include <tuple>

#define LINE_LENGTH 11

class Line {
private:
    std::array<Cell*, LINE_LENGTH> cells;
    Cell deadCell;

public:
    Line();
    Cell*& operator[](size_t idx);
    std::tuple<int, int, int, int> countLine();
    Line shiftLine(Line& line, int n);
};
