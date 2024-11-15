#pragma once

#include "cell.h" // `cell.cpp` 대신 `cell.h`를 포함
#include <array>
#include <tuple>

#define LINE_LENGTH 11

using namespace std;

class Line {
private:
    array<Cell*, LINE_LENGTH> cells; // Cell 포인터 배열
    Cell deadCell; // Dead cell for out-of-bound handling

public:
    Line(); // Constructor
    Cell*& operator[](size_t idx); // Index operator
    tuple<int, int, int, int> countLine(); // Count line properties
    Line shiftLine(Line& line, int n); // Shift the line
};
