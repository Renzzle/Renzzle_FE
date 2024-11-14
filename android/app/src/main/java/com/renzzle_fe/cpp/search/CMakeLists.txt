add_library(search-lib VCF_search.cpp)
target_include_directories(search-lib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/../evaluate ${CMAKE_CURRENT_SOURCE_DIR}/../tree)
