#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

#include "cpp/search/search_win.h"
#include "cpp/search/search.h"
#include "cpp/test/util.h"
#include "cpp/game/board.h"
#include "cpp/engine/engine.h"
#include <string>

// ==========================================
// 1. SearchJNI 모듈
// ==========================================
@interface SearchModule : NSObject <RCTBridgeModule>
@end

@implementation SearchModule
RCT_EXPORT_MODULE(SearchJNI);

RCT_EXPORT_METHOD(findWinWrapper:(NSString *)boardData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        std::string cppResult = validatePuzzle([boardData UTF8String]);
        resolve([NSString stringWithUTF8String:cppResult.c_str()]);
    } @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to perform VCF search", nil);
    }
}
@end

// ==========================================
// 2. UserAgainstActionJNI 모듈
// ==========================================
@interface UserAgainstActionModule : NSObject <RCTBridgeModule>
@end

@implementation UserAgainstActionModule
RCT_EXPORT_MODULE(UserAgainstActionJNI);

RCT_EXPORT_METHOD(calculateSomethingWrapper:(NSString *)boardData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        int result = findNextMove([boardData UTF8String]);
        resolve(@(result));
    } @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to react user move", nil);
    }
}
@end

// ==========================================
// 3. CheckWinJNI 모듈
// ==========================================
@interface CheckWinModule : NSObject <RCTBridgeModule>
@end

@implementation CheckWinModule
RCT_EXPORT_MODULE(CheckWinJNI);

RCT_EXPORT_METHOD(checkWinWrapper:(NSString *)boardData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        Board board = getBoard([boardData UTF8String]);
        int result = 0;
        
        if (board.getResult() == BLACK_WIN) {
            result = board.isBlackTurn() ? 0 : 1;
        } else if (board.getResult() == WHITE_WIN) {
            result = board.isBlackTurn() ? 1 : 0;
        }
        
        resolve(@(result));
    } @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to check win", nil);
    }
}
@end
