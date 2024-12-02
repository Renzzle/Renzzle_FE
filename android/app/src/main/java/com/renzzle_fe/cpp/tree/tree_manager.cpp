#include "tree_manager.h"
//#include "tree.h"

TreeManager::TreeManager(Board initialBoard) {
    auto rootNode = tree.createNode(initialBoard);
    tree.addNodeAsRoot(rootNode);
    currentNode = rootNode;
    nodeHistory.push(currentNode);
}

bool TreeManager::move(Pos p) {
    shared_ptr<Node> previousNode = currentNode;

    // if child node exists
    for (const auto& pair : previousNode->childNodes) {
        shared_ptr<Node> node = pair.second;
        if (node->board.getPath().back() == p) {
            currentNode = node;
            nodeHistory.push(currentNode);
            return true;
        }
    }

    // create new child node
    Board newBoard = previousNode->board;
    bool result = newBoard.move(p);
    if (!result) return result; // move failed

    currentNode = tree.createNode(newBoard);
    tree.addNode(previousNode, currentNode);
    nodeHistory.push(currentNode);
    return result;
}

void TreeManager::undo() {
    // remain at root node
    if (nodeHistory.size() > 1) {
        nodeHistory.pop();
        currentNode = nodeHistory.top();
    }
}

void TreeManager::cleanCache() {
    tree.cleanTree();
}

Board& TreeManager::getBoard() {
    return currentNode->board;
}

shared_ptr<Node> TreeManager::getChildNode(Pos p) {
    for (const auto& pair : currentNode->childNodes) {
        shared_ptr<Node> node = pair.second;
        if (node->board.getPath().back() == p) {
            return node;
        }
    }
    return nullptr; // if cannot find
}

shared_ptr<Node> TreeManager::getNode() {
    return currentNode;
}
