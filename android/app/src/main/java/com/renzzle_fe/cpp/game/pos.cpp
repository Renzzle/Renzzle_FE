#pragma once

#include "types.cpp"

#define BOARD_SIZE 15

class Pos {

    friend class Board;

private:
    int x, y;
    Direction dir;
    int inc[DIRECTION_SIZE][2] = {{0,1},{1,0},{1,1},{1,-1}};
    bool isValid() {
        return x >= 1 && x <= BOARD_SIZE && y >= 1 && y <= BOARD_SIZE;
    }

public:
    Pos() {
        x = 0; y = 0; dir = HORIZONTAL;
    };

    Pos(int x, int y) {
        this->x = x;
        this->y = y;
        dir = HORIZONTAL;
    }

    Pos(int x, int y, Direction dir) {
        this->x = x;
        this->y = y;
        this->dir = dir;
    }

    int getX() const {
        return x;
    }

    int getY() const {
        return y;
    }

    bool operator+(const int n) {
        this->x += inc[dir][0] * n;
        this->y += inc[dir][1] * n;
        if (!isValid()) {
            this->x -= inc[dir][0] * n;
            this->y -= inc[dir][1] * n;
            return false;
        } else return true;
    }

    bool operator-(const int n) {
        this->x -= inc[dir][0] * n;
        this->y -= inc[dir][1] * n;
        if (!isValid()) {
            this->x += inc[dir][0] * n;
            this->y += inc[dir][1] * n;
            return false;
        } else return true;
    }

    bool operator<(const Pos& other) const {
        if (x == other.x) return y < other.y;
        return x < other.x;
    }

    bool operator==(const Pos& other) const {
        return x == other.x && y == other.y;
    }

};