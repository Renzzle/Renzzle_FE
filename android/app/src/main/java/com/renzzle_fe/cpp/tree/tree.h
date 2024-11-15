#pragma once

#include "../game/board.h"
#include "../evaluate/evaluator.h"
#include "../test/test.h"
#include <unordered_map>
#include <memory>

struct Node {
    Board board;
    Value value;
    Result result;
    std::unordered_map<size_t, std::shared_ptr<Node>> childNodes;

    Node(Board b) : board(b), value(INITIAL_VALUE), result(ONGOING) {}
};

class Tree {

private:
    std::unordered_map<size_t, std::shared_ptr<Node>> nodeMap;

public:
    void addNodeAsRoot(std::shared_ptr<Node> node);
    void addNode(std::shared_ptr<Node> parentNode, std::shared_ptr<Node> node);
    std::shared_ptr<Node> createNode(Board board);
    bool exist(Board& board);
};
