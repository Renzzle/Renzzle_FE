#pragma once

#include "../game/board.h"
#include "../evaluate/evaluator.h"
#include "../test/test.h"
#include <unordered_map>
#include <memory>

struct Node {
    Board board;
    Value actualValue;
    Value evaluatedValue;
    Result result;
    unordered_map<size_t, shared_ptr<Node>> childNodes;
    int visitedCnt;

    Node(Board b) : board(b), actualValue(INITIAL_VALUE), evaluatedValue(INITIAL_VALUE), result(ONGOING), visitedCnt(0) {}
};

class Tree {

private:
    unordered_map<size_t, shared_ptr<Node>> nodeMap;

public:
    void addNodeAsRoot(shared_ptr<Node> node);
    void addNode(shared_ptr<Node> parentNode, shared_ptr<Node> node);
    void cleanTree();
    shared_ptr<Node> createNode(Board board);
    bool exist(Board& board);

};