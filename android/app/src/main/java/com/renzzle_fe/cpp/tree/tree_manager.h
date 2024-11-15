#pragma once

#include "tree.h"
#include "../test/test.h"
#include <stack>

class TreeManager {

private:
    static Tree tree;
    shared_ptr<Node> currentNode;
    std::stack<shared_ptr<Node>> nodeHistory;

public:
    TreeManager(Board initialBoard);
    bool move(Pos p);
    void undo();
    void cleanCache();
    Board& getBoard();
    shared_ptr<Node> getChildNode(Pos p);
    shared_ptr<Node> getNode();
};
