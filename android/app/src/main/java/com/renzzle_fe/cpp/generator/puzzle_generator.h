#pragma once

#include "../search/search.h"
#include "../test/util.h"
#include <random>
#include <thread>

#define SEED_NUMBER 10

class PuzzleGenerator {

private:
    const string seeds[SEED_NUMBER] = {
            "h8h9i8g8i10",
            "h8h9i9i8g10",
            "h8h9h6i9g9",
            "h8h9j8g8i9",
            "h8h9h10i9g9",
            "h8h9i8i9g9",
            "h8i9j7j8h10",
            "h8i9j9i8i7",
            "h8i9i7g9j8",
            "h8i9h7h9g9"
    };
    Board puzzle;
    mutex puzzleMutex;

    void findWin(Board board);

public:
    Board generatePuzzle();

};