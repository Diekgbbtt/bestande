//
//  ReactCommunicator.m
//  BestandeReact
//
//  Created by Jonny Burger on 21.02.16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ReactCommunicator.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTRootView.h>
#import <UIKit/UIKit.h>


@implementation ReactCommunicator

- (id) init {
  if (self = [super init]) {
  }
  return self;
}

+ (id)sharedCommunicator {
  static ReactCommunicator *sharedMyCommunicator = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedMyCommunicator = [[self alloc] init];
  });
  return sharedMyCommunicator;
}

- (void) sendEvent:(NSString *)eventName withUserInfo:(NSDictionary *)userInfo {
  RCTRootView *rootView = (RCTRootView *)[UIApplication sharedApplication].delegate.window.rootViewController.view;
  [rootView.bridge.eventDispatcher sendAppEventWithName:eventName body:userInfo];
}

@end
