#include "tree.h"

void Tree::addNodeAsRoot(shared_ptr<Node> root) {
    size_t key = root->board.getCurrentHash();
    nodeMap[key] = root;
}

void Tree::addNode(shared_ptr<Node> parentNode, shared_ptr<Node> node) {
    size_t key = node->board.getCurrentHash();
    nodeMap[key] = node;
    parentNode->childNodes[key] = node;
}

void Tree::cleanTree() {
    nodeMap.clear();
}

shared_ptr<Node> Tree::createNode(Board board) {
    size_t key = board.getCurrentHash();
    auto it = nodeMap.find(key);
    if (it != nodeMap.end()) {
        return it->second; // node already exists
    }
    auto newNode = make_shared<Node>(board);
    return newNode;
}

bool Tree::exist(Board& board) {
    size_t key = board.getCurrentHash();
    auto it = nodeMap.find(key);
    if (it != nodeMap.end()) {
        return true;
    }
    return false;
}
