add_library(evaluate-lib evaluator.cpp)
target_include_directories(evaluate-lib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/../game)
