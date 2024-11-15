#include "types.h"

Direction operator++(Direction& dir, int) {
    int d = static_cast<int>(dir);
    d++;
    if (d >= DIRECTION_SIZE) {
        d = DIRECTION_SIZE - 1;
    }
    dir = static_cast<Direction>(d);
    return static_cast<Direction>(d);
}

Direction operator--(Direction& dir, int) {
    int d = static_cast<int>(dir);
    d--;
    if (d < 0) {
        d = 0;
    }
    dir = static_cast<Direction>(d);
    return static_cast<Direction>(d);
}

bool operator<(Direction dir1, Direction dir2) {
    return static_cast<int>(dir1) < static_cast<int>(dir2);
}

bool operator>(Direction dir1, Direction dir2) {
    return static_cast<int>(dir1) > static_cast<int>(dir2);
}
