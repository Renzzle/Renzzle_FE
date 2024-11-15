#include "tree.h"

void Tree::addNodeAsRoot(std::shared_ptr<Node> root) {
    size_t key = root->board.getCurrentHash();
    nodeMap[key] = root;
}

void Tree::addNode(std::shared_ptr<Node> parentNode, std::shared_ptr<Node> node) {
    size_t key = node->board.getCurrentHash();
    nodeMap[key] = node;
    parentNode->childNodes[key] = node;
}

std::shared_ptr<Node> Tree::createNode(Board board) {
    size_t key = board.getCurrentHash();
    auto it = nodeMap.find(key);
    if (it != nodeMap.end()) {
        return it->second; // node already exists
    }
    auto newNode = std::make_shared<Node>(board);
    return newNode;
}

bool Tree::exist(Board& board) {
    size_t key = board.getCurrentHash();
    return nodeMap.find(key) != nodeMap.end();
}
