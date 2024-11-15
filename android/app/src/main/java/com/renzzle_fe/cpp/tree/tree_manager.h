#pragma once

#include "tree.h"
#include "../test/test.h"
#include <stack>

class TreeManager {

private:
    static Tree tree;
    std::shared_ptr<Node> currentNode;
    std::stack<std::shared_ptr<Node>> nodeHistory;

public:
    TreeManager(Board initialBoard);
    bool move(Pos p);
    void undo();
    bool isVisited(Pos p);
    Board& getBoard();
};

