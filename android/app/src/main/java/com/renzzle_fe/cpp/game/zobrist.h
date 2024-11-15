#pragma once

#include "board.h"
#include <random>
#include <mutex>

#define NUM_PIECE_TYPES 4

// Functions to manage Zobrist hashing
void initializeZobristTable();
size_t getZobristValue(int x, int y, Piece piece);
