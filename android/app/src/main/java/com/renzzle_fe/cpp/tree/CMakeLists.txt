add_library(tree-lib tree.cpp tree_manager.cpp)
target_include_directories(tree-lib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/../game)
