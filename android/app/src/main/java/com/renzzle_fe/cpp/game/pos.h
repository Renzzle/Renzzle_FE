#pragma once

#include "types.h" // `types.cpp` 대신 `types.h`를 포함

#define BOARD_SIZE 15

class Pos {
    friend class Board;

private:
    int x, y;
    Direction dir;
    int inc[DIRECTION_SIZE][2] = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};

    bool isValid();

public:
    Pos();
    Pos(int x, int y);
    Pos(int x, int y, Direction dir);

    int getX() const;
    int getY() const;

    bool operator+(const int n);
    bool operator-(const int n);
    bool operator<(const Pos& other) const;
    bool operator==(const Pos& other) const;
};