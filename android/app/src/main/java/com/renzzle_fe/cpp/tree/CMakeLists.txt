# tree-lib 라이브러리 생성 및 소스 파일 추가
add_library(tree-lib
        tree.cpp
        tree_manager.cpp
)

# include 디렉토리 설정
target_include_directories(tree-lib PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}
        ${CMAKE_CURRENT_SOURCE_DIR}/../game
        ${CMAKE_CURRENT_SOURCE_DIR}/../test
)
