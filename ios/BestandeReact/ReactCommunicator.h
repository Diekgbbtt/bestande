//
//  ReactCommunicator.h
//  BestandeReact
//
//  Created by Jonny Burger on 21.02.16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#ifndef ReactCommunicator_h
#define ReactCommunicator_h

@interface ReactCommunicator : NSObject

+ (id) sharedCommunicator;

- (void) sendEvent:(NSString *)eventName withUserInfo:(NSDictionary *)userInfo;

@end

#endif /* ReactCommunicator_h */
