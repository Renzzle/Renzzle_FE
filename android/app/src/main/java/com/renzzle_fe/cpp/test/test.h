#pragma once

#include <iostream>
#include <vector>
#include <functional>
#include <stdexcept>
#include <chrono>
#include <string>

#define TEST

#ifdef TEST

//#define PRIVATE public:
//#define PUBLIC public:

#define TEST_PRINT(msg) std::cout << msg << std::endl

#define TEST_TIME_START() \
auto start_time = std::chrono::high_resolution_clock::now();

#define TEST_TIME_END(message) \
auto end_time = std::chrono::high_resolution_clock::now(); \
auto duration = std::chrono::duration_cast<std::chrono::nanoseconds>(end_time - start_time); \
double seconds = duration.count() / 1e9; \
std::cout << message << " is taken " << seconds  << " sec" << std::endl;

#define TEST_ASSERT(expr) Test::assertState((expr), #expr, __FILE__, __LINE__)

#else

#define PRIVATE private:
#define PUBLIC public:

#define TEST_PRINT(msg)
#define TEST_TIME_START()
#define TEST_TIME_END(message)
#define TEST_ASSERT(expression)

#endif

using namespace std;

class Test {
public:
    virtual ~Test() = default;
    using TestMethod = function<void()>;

    static void assertState(bool state, const string& expression, const char* file, int line);

    void registerTestMethod(const TestMethod& method);

    void runAllTests();

protected:
    vector<TestMethod> testMethods;
};
