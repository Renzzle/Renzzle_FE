cmake_minimum_required(VERSION 3.13)

# React Native builds appmodules from here only when no CMakeLists is given, so it is set up here
# together with the renju engine
project(appmodules)

include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

add_subdirectory(../java/com/renzzle_fe/cpp native-lib)
