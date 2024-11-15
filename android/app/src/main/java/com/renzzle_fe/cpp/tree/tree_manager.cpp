#include "tree_manager.h"

Tree TreeManager::tree;

TreeManager::TreeManager(Board initialBoard) {
    auto rootNode = tree.createNode(initialBoard);
    tree.addNodeAsRoot(rootNode);
    currentNode = rootNode;
    nodeHistory.push(currentNode);
}

bool TreeManager::move(Pos p) {
    std::shared_ptr<Node> previousNode = currentNode;

    // if child node exists
    for (const auto& pair : previousNode->childNodes) {
        std::shared_ptr<Node> node = pair.second;
        if (node->board.getPath().back() == p) {
            currentNode = node;
            nodeHistory.push(currentNode);
            return true;
        }
    }

    // new child node
    Board newBoard = previousNode->board;
    bool result = newBoard.move(p);
    if (!result) return result; // move failed

    currentNode = tree.createNode(newBoard);
    tree.addNode(previousNode, currentNode);
    nodeHistory.push(currentNode);
    return result;
}

void TreeManager::undo() {
    // remain root node
    if (nodeHistory.size() > 1) {
        nodeHistory.pop();
        currentNode = nodeHistory.top();
    }
}

bool TreeManager::isVisited(Pos p) {
    if (currentNode->childNodes.empty())
        return false;

    for (const auto& pair : currentNode->childNodes) {
        std::shared_ptr<Node> node = pair.second;
        if (node->board.getPath().back() == p) {
            return true;
        }
    }
    return false;
}

Board& TreeManager::getBoard() {
    return currentNode->board;
}
