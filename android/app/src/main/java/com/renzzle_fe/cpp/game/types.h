#pragma once

// Enumeration for game results
enum Result {
    ONGOING,
    BLACK_WIN,
    WHITE_WIN,
    DRAW
};

// Enumeration for stone colors
enum Color {
    COLOR_BLACK,
    COLOR_WHITE
};

// Enumeration for board pieces
enum Piece {
    BLACK,
    WHITE,
    EMPTY,
    WALL
};

// Enumeration for pattern types
enum Pattern {
    NONE,       // 00
    DEAD,       // 01. can never make a five
    OVERLINE,   // 02. overline
    BLOCKED_1,  // 03. one step before BLOCKED_2
    FREE_1,     // 04. one step before FREE_2
    BLOCKED_2,  // 05. one step before BLOCKED_3
    FREE_2,     // 06. one step before two FREE_3
    FREE_2A,    // 07. one step before three FREE_3
    FREE_2B,    // 08. one step before four FREE_3
    BLOCKED_3,  // 09. one step before BLOCKED_4
    FREE_3,     // 10. one step before one FREE_4
    FREE_3A,    // 11. one step before two FREE_4
    BLOCKED_4,  // 12. one step before FREE_5
    FREE_4,     // 13. one step before two FREE_5
    FIVE,       // 14. five
    PATTERN_SIZE
};

// Direction-related constants
#define DIRECTION_START HORIZONTAL

// Enumeration for directions
enum Direction {
    HORIZONTAL,
    VERTICAL,
    UPWARD,
    DOWNWARD,
    DIRECTION_SIZE
};

// Operators for Direction (declared in the header, defined in the source)
Direction operator++(Direction& dir, int);
Direction operator--(Direction& dir, int);
bool operator<(Direction dir1, Direction dir2);
bool operator>(Direction dir1, Direction dir2);
