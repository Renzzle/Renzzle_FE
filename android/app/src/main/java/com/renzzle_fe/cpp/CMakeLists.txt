cmake_minimum_required(VERSION 3.10)

project(MyNDKProject)

# 각 모듈 디렉토리 추가
add_subdirectory(app/cpp/evaluate)
add_subdirectory(app/cpp/game)
add_subdirectory(app/cpp/search)
add_subdirectory(app/cpp/test)
add_subdirectory(app/cpp/tree)

# JNI용 라이브러리 빌드
add_library(
        native-lib
        SHARED
        jni/VCFSearchJNI.cpp
)

# 서브 디렉토리 내 타겟 라이브러리들과 연결
target_link_libraries(
        native-lib
        evaluate-lib
        game-lib
        search-lib
        test-lib
        tree-lib
)
