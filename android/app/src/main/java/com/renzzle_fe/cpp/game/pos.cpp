#include "pos.h"

Pos::Pos() {
    x = -1;
    y = -1;
    dir = HORIZONTAL;
}

Pos::Pos(int x, int y) {
    this->x = x;
    this->y = y;
    if (!isValid()) {
        this->x = -1;
        this->y = -1;
    }
    dir = HORIZONTAL;
}

Pos::Pos(int x, int y, Direction dir) {
    this->x = x;
    this->y = y;
    this->dir = dir;
    if (!isValid()) {
        this->x = -1;
        this->y = -1;
    }
}

bool Pos::isValid() {
    return x >= 1 && x <= BOARD_SIZE && y >= 1 && y <= BOARD_SIZE;
}

int Pos::getX() const {
    return x;
}

int Pos::getY() const {
    return y;
}

void Pos::setDirection(Direction dir) {
    this->dir = dir;
}

bool Pos::operator+(const int n) {
    this->x += inc[dir][0] * n;
    this->y += inc[dir][1] * n;
    if (!isValid()) {
        this->x -= inc[dir][0] * n;
        this->y -= inc[dir][1] * n;
        return false;
    } else {
        return true;
    }
}

bool Pos::operator-(const int n) {
    this->x -= inc[dir][0] * n;
    this->y -= inc[dir][1] * n;
    if (!isValid()) {
        this->x += inc[dir][0] * n;
        this->y += inc[dir][1] * n;
        return false;
    } else {
        return true;
    }
}

bool Pos::operator<(const Pos& other) const {
    if (x == other.x) {
        return y < other.y;
    }
    return x < other.x;
}

bool Pos::operator==(const Pos& other) const {
    return x == other.x && y == other.y;
}

bool Pos::isDefault() {
    return (x == -1) && (y == -1);
}
