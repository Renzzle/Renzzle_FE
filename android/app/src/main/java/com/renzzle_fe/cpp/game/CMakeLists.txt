# 모든 소스 파일을 포함하여 game-lib 라이브러리를 정의
add_library(game-lib
        board.cpp
        cell.cpp
        line.cpp
        pos.cpp
        types.cpp
        zobrist.cpp
)

# game-lib 라이브러리에 test 디렉토리를 포함 디렉토리로 추가
target_include_directories(game-lib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} ${CMAKE_CURRENT_SOURCE_DIR}/../test)