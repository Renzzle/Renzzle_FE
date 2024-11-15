#include "pos.h"

// Default constructor
Pos::Pos() {
    x = 0;
    y = 0;
    dir = HORIZONTAL;
}

// Constructor with x and y
Pos::Pos(int x, int y) {
    this->x = x;
    this->y = y;
    dir = HORIZONTAL;
}

// Constructor with x, y, and direction
Pos::Pos(int x, int y, Direction dir) {
    this->x = x;
    this->y = y;
    this->dir = dir;
}

// Check if position is valid
bool Pos::isValid() {
    return x >= 1 && x <= BOARD_SIZE && y >= 1 && y <= BOARD_SIZE;
}

// Get x-coordinate
int Pos::getX() const {
    return x;
}

// Get y-coordinate
int Pos::getY() const {
    return y;
}

// Operator+ to increment position
bool Pos::operator+(const int n) {
    this->x += inc[dir][0] * n;
    this->y += inc[dir][1] * n;
    if (!isValid()) {
        this->x -= inc[dir][0] * n;
        this->y -= inc[dir][1] * n;
        return false;
    }
    return true;
}

// Operator- to decrement position
bool Pos::operator-(const int n) {
    this->x -= inc[dir][0] * n;
    this->y -= inc[dir][1] * n;
    if (!isValid()) {
        this->x += inc[dir][0] * n;
        this->y += inc[dir][1] * n;
        return false;
    }
    return true;
}

// Operator< for comparison
bool Pos::operator<(const Pos& other) const {
    if (x == other.x) return y < other.y;
    return x < other.x;
}

// Operator== for equality check
bool Pos::operator==(const Pos& other) const {
    return x == other.x && y == other.y;
}
