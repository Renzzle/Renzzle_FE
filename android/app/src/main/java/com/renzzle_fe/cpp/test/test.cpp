#include "test.h"

void Test::assertState(bool state, const string& expression, const char* file, int line) {
    try {
        if (!state) {
            throw runtime_error(expression +
                                ", File: " + string(file) +
                                ", Line: " + to_string(line));
        }
    } catch (const exception& e) {
        cerr << "\033[31mAssertion Error: " << e.what() << "\033[0m" << endl;
    }
}

void Test::registerTestMethod(const TestMethod& method) {
    testMethods.push_back(method);
}

void Test::runAllTests() {
    for (const auto& method : testMethods) {
        method();
    }
}
