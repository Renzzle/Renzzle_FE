cmake_minimum_required(VERSION 3.10)

project(RenzzleNDKProject)

# Android NDK 설정
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# JNI 라이브러리만 빌드 (헤더 파일들은 include만 하면 됨)
add_library(
        native-lib
        SHARED
        jni/RenzzleJNI.cpp
)

# 모든 헤더 파일들이 있는 디렉토리들을 include 경로에 추가
target_include_directories(native-lib PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}
        ${CMAKE_CURRENT_SOURCE_DIR}/jni
        ${CMAKE_CURRENT_SOURCE_DIR}/test
        ${CMAKE_CURRENT_SOURCE_DIR}/game
        ${CMAKE_CURRENT_SOURCE_DIR}/evaluate
        ${CMAKE_CURRENT_SOURCE_DIR}/tree
        ${CMAKE_CURRENT_SOURCE_DIR}/search
        ${CMAKE_CURRENT_SOURCE_DIR}/generator
)