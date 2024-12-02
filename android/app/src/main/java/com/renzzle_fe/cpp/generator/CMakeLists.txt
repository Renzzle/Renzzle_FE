add_library(generator-lib
        puzzle_generator.cpp
)

# include 디렉터리 설정
target_include_directories(generator-lib PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}
        ${CMAKE_CURRENT_SOURCE_DIR}/../evaluate
        ${CMAKE_CURRENT_SOURCE_DIR}/../search
        ${CMAKE_CURRENT_SOURCE_DIR}/../tree
        ${CMAKE_CURRENT_SOURCE_DIR}/../test
)
