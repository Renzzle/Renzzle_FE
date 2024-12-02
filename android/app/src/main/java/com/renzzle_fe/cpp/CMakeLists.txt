cmake_minimum_required(VERSION 3.10)

project(MyNDKProject)

# 각 모듈 디렉토리 추가
add_subdirectory(evaluate)
add_subdirectory(game)
add_subdirectory(generator)
add_subdirectory(search)
add_subdirectory(test)
add_subdirectory(tree)

# JNI용 라이브러리 빌드
add_library(
        native-lib
        SHARED
        jni/RenzzleJNI.cpp
)

# 서브 디렉토리 내 타겟 라이브러리들과 연결
target_link_libraries(
        native-lib
        evaluate-lib
        game-lib
        generator-lib
        search-lib
        test-lib
        tree-lib
)

# include 디렉토리 설정
target_include_directories(native-lib PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/evaluate
        ${CMAKE_CURRENT_SOURCE_DIR}/game
        ${CMAKE_CURRENT_SOURCE_DIR}/generator
        ${CMAKE_CURRENT_SOURCE_DIR}/search
        ${CMAKE_CURRENT_SOURCE_DIR}/test
        ${CMAKE_CURRENT_SOURCE_DIR}/tree
        ${CMAKE_CURRENT_SOURCE_DIR}/jni
)
