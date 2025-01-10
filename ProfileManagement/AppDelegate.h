//
//  AppDelegate.h
//  ProfileManagement
//
//  Created by Gaurav Prakash on 11/01/25.
//

#import <UIKit/UIKit.h>
#import <CoreData/CoreData.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (readonly, strong) NSPersistentContainer *persistentContainer;

- (void)saveContext;


@end

