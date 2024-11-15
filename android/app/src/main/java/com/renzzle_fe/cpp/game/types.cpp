#include "types.h"

// Increment operator for Direction
Direction operator++(Direction& dir, int) {
    int d = static_cast<int>(dir);
    d++;
    if (d > 4) d = 4; // Boundary check
    dir = static_cast<Direction>(d);
    return static_cast<Direction>(d);
}

// Decrement operator for Direction
Direction operator--(Direction& dir, int) {
    int d = static_cast<int>(dir);
    d--;
    if (d < 0) {
        d = 0;
    }
    dir = static_cast<Direction>(d);
    return static_cast<Direction>(d);
}

// Less-than operator for Direction
bool operator<(Direction dir1, Direction dir2) {
    return static_cast<int>(dir1) < static_cast<int>(dir2);
}

// Greater-than operator for Direction
bool operator>(Direction dir1, Direction dir2) {
    return static_cast<int>(dir1) > static_cast<int>(dir2);
}
