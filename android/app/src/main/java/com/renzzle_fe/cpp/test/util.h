#pragma once

#include <iostream>
#include <chrono>
#include <cassert>
#include <vector>
#include <string>
#include <sstream>
#include "../game/board.h"

#ifdef _WIN32
#include <Windows.h>
#endif

using namespace std;

vector<pair<int, int>> processString(const string& input);

Board getBoard(const string& moves);

void printBoard(Board& board);

void printPatternCells(CellArray& cells, Piece p, Direction k);

void printBoardPattern(Board& board, Piece p);

void printPath(MoveList path);

string pathToString(const MoveList& path);
