# search-lib 라이브러리 추가 및 소스 파일 지정
add_library(search-lib
        search.cpp
        search_monitor.cpp
        search_win.cpp
)

# include 디렉터리 설정
target_include_directories(search-lib PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}                   # search-lib 패키지 내 헤더 접근
        ${CMAKE_CURRENT_SOURCE_DIR}/../evaluate
        ${CMAKE_CURRENT_SOURCE_DIR}/../tree
        ${CMAKE_CURRENT_SOURCE_DIR}/../test
)
