# test-lib 라이브러리 추가 및 소스 파일 지정
add_library(test-lib test.cpp util.cpp)

# include 디렉터리 설정
target_include_directories(test-lib PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}
)