#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

#include "cpp/search/search_win.h"
#include "cpp/search/search.h"
#include "cpp/test/util.h"
#include "cpp/game/board.h"
#include "cpp/engine/engine.h"

#include <string>
#include <memory>
#include <mutex>
#include <unordered_map>

using namespace std;

// JNI 코드에서 사용한 Job 관리 로직을 iOS 파일 혹은 공용 C++ 공간에 정의합니다.
namespace iOS_JNI_Bridge {
    using JobMap = unordered_map<int, shared_ptr<EngineCancelToken>>;

    static mutex gFindWinJobsMutex;
    static mutex gUserMoveJobsMutex;
    static JobMap gFindWinJobs;
    static JobMap gUserMoveJobs;

    static shared_ptr<EngineCancelToken> startJob(JobMap& jobs, mutex& jobsMutex, int requestId) {
        auto token = make_shared<EngineCancelToken>();
        lock_guard<mutex> lock(jobsMutex);

        auto existing = jobs.find(requestId);
        if (existing != jobs.end()) {
            existing->second->cancel();
        }
        jobs[requestId] = token;
        return token;
    }

    static void cancelJob(JobMap& jobs, mutex& jobsMutex, int requestId) {
        lock_guard<mutex> lock(jobsMutex);

        auto existing = jobs.find(requestId);
        if (existing != jobs.end()) {
            existing->second->cancel();
        }
    }

    static void finishJob(JobMap& jobs, mutex& jobsMutex, int requestId, const shared_ptr<EngineCancelToken>& token) {
        lock_guard<mutex> lock(jobsMutex);

        auto existing = jobs.find(requestId);
        if (existing != jobs.end() && existing->second == token) {
            jobs.erase(existing);
        }
    }
}

// 취소가 정상적으로 이루어지도록 CONCURRENT 큐 사용
static dispatch_queue_t RenzzleJNIQueue()
{
    static dispatch_queue_t queue;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        queue = dispatch_queue_create("com.renzzle_fe.jni", DISPATCH_QUEUE_CONCURRENT);
    });
    return queue;
}

// ==========================================
// 1. SearchJNI 모듈
// ==========================================
@interface SearchModule : NSObject <RCTBridgeModule>
@property (nonatomic, strong) NSMutableSet<NSNumber *> *cancelledRequestIds;
@end

@implementation SearchModule
RCT_EXPORT_MODULE(SearchJNI);

- (instancetype)init {
    if (self = [super init]) {
        _cancelledRequestIds = [NSMutableSet new];
    }
    return self;
}

- (dispatch_queue_t)methodQueue
{
    return RenzzleJNIQueue();
}

RCT_EXPORT_METHOD(findWinWrapper:(nonnull NSNumber *)requestId
                  boardData:(NSString *)boardData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    int reqId = [requestId intValue];
    
    @try {
        @synchronized (self.cancelledRequestIds) {
            if ([self.cancelledRequestIds containsObject:requestId]) {
                [self.cancelledRequestIds removeObject:requestId];
                resolve(@{@"status": @"cancelled"});
                return;
            }
        }

        // C++ 잡 시작 및 토큰 생성
        auto token = iOS_JNI_Bridge::startJob(iOS_JNI_Bridge::gFindWinJobs, iOS_JNI_Bridge::gFindWinJobsMutex, reqId);
        
        // 실제 엔진 분석 수행
        ValidatePuzzleResult result = validatePuzzleWithResult([boardData UTF8String], token.get());
        
        iOS_JNI_Bridge::finishJob(iOS_JNI_Bridge::gFindWinJobs, iOS_JNI_Bridge::gFindWinJobsMutex, reqId, token);

        BOOL isCancelled = NO;
        @synchronized (self.cancelledRequestIds) {
            if ([self.cancelledRequestIds containsObject:requestId]) {
                [self.cancelledRequestIds removeObject:requestId];
                isCancelled = YES;
            }
        }

        if (isCancelled || result.cancelled) {
            resolve(@{@"status": @"cancelled"});
            return;
        }

        resolve(@{
            @"status": @"ok",
            @"result": [NSString stringWithUTF8String:result.solution.c_str()]
        });
    } @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to perform VCF search", nil);
    } @finally {
        @synchronized (self.cancelledRequestIds) {
            [self.cancelledRequestIds removeObject:requestId];
        }
    }
}

RCT_EXPORT_METHOD(cancelFindWin:(nonnull NSNumber *)requestId)
{
    @synchronized (self.cancelledRequestIds) {
        [self.cancelledRequestIds addObject:requestId];
    }
    // C++ 잡 취소 호출
    iOS_JNI_Bridge::cancelJob(iOS_JNI_Bridge::gFindWinJobs, iOS_JNI_Bridge::gFindWinJobsMutex, [requestId intValue]);
}
@end

// ==========================================
// 2. UserAgainstActionJNI 모듈
// ==========================================
@interface UserAgainstActionModule : NSObject <RCTBridgeModule>
@property (nonatomic, strong) NSMutableSet<NSNumber *> *cancelledRequestIds;
@end

@implementation UserAgainstActionModule
RCT_EXPORT_MODULE(UserAgainstActionJNI);

- (instancetype)init {
    if (self = [super init]) {
        _cancelledRequestIds = [NSMutableSet new];
    }
    return self;
}

- (dispatch_queue_t)methodQueue
{
    return RenzzleJNIQueue();
}

RCT_EXPORT_METHOD(calculateSomethingWrapper:(nonnull NSNumber *)requestId
                  boardData:(NSString *)boardData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    int reqId = [requestId intValue];
    
    @try {
        @synchronized (self.cancelledRequestIds) {
            if ([self.cancelledRequestIds containsObject:requestId]) {
                [self.cancelledRequestIds removeObject:requestId];
                resolve(@{@"status": @"cancelled"});
                return;
            }
        }

        // C++ 잡 시작 및 토큰 생성
        auto token = iOS_JNI_Bridge::startJob(iOS_JNI_Bridge::gUserMoveJobs, iOS_JNI_Bridge::gUserMoveJobsMutex, reqId);
        
        // 실제 엔진 분석 수행
        FindNextMoveAnalysis analysis = analyzeNextMove([boardData UTF8String], token.get());
        
        iOS_JNI_Bridge::finishJob(iOS_JNI_Bridge::gUserMoveJobs, iOS_JNI_Bridge::gUserMoveJobsMutex, reqId, token);

        BOOL isCancelled = NO;
        @synchronized (self.cancelledRequestIds) {
            if ([self.cancelledRequestIds containsObject:requestId]) {
                [self.cancelledRequestIds removeObject:requestId];
                isCancelled = YES;
            }
        }

        if (isCancelled || analysis.cancelled) {
            resolve(@{@"status": @"cancelled"});
            return;
        }

        resolve(@{
            @"status": @"ok",
            @"move": @(analysis.move)
        });
    } @catch (NSException *exception) {
        reject(@"ERROR", @"Failed to react user move", nil);
    } @finally {
        @synchronized (self.cancelledRequestIds) {
            [self.cancelledRequestIds removeObject:requestId];
        }
    }
}

RCT_EXPORT_METHOD(cancelCalculate:(nonnull NSNumber *)requestId)
{
    @synchronized (self.cancelledRequestIds) {
        [self.cancelledRequestIds addObject:requestId];
    }
    // C++ 잡 취소 호출
    iOS_JNI_Bridge::cancelJob(iOS_JNI_Bridge::gUserMoveJobs, iOS_JNI_Bridge::gUserMoveJobsMutex, [requestId intValue]);
}
@end

// ==========================================
// 3. CheckWinJNI 모듈
// ==========================================
@interface CheckWinModule : NSObject <RCTBridgeModule>
@end

@implementation CheckWinModule
RCT_EXPORT_MODULE(CheckWinJNI);

- (dispatch_queue_t)methodQueue
{
    return RenzzleJNIQueue();
}

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
