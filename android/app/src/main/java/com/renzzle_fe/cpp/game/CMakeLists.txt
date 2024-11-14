add_library(game-lib board.cpp cell.cpp line.cpp pos.cpp types.cpp zobrist.cpp)
target_include_directories(game-lib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/../test)
