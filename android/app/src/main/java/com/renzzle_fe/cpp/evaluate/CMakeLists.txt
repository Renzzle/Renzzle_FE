# Add the evaluator library
add_library(evaluate-lib
        evaluator.cpp
)

# Add include directories for the library
target_include_directories(evaluate-lib
        PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/../game  # ../game 디렉토리 추가
        PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}         # evaluator.h가 있는 디렉토리 추가
)