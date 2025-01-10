//
//  ProfileViewController.m
//  ProfileManagement
//
//  Created by Gaurav Prakash on 11/01/25.
//

#import "ProfileViewController.h"

@interface ProfileViewController () <UITableViewDelegate, UITableViewDataSource, UIImagePickerControllerDelegate, UINavigationControllerDelegate>

// UI Elements
@property (strong, nonatomic) UITableView *tableView;
@property (strong, nonatomic) UIImageView *profileImageView;

// Data
@property (strong, nonatomic) NSArray *personalInfoFields; // Placeholder titles for personal info fields
@property (strong, nonatomic) NSMutableArray *personalInfoValues; // User-provided values for personal info
@property (strong, nonatomic) NSString *selectedTheme;

@end

@implementation ProfileViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"Profile";
    self.view.backgroundColor = [UIColor whiteColor];
    
    [self setupTableView];
    [self setupDefaultData];
    [self setupSaveButton];
}

#pragma mark - Setup Methods

- (void)setupTableView {
    self.tableView = [[UITableView alloc] initWithFrame:self.view.bounds style:UITableViewStyleGrouped];
    self.tableView.delegate = self;
    self.tableView.dataSource = self;
    [self.view addSubview:self.tableView];
}

- (void)setupDefaultData {
    self.personalInfoFields = @[@"Name", @"Email", @"Phone"];
    self.personalInfoValues = [@[@"", @"", @""] mutableCopy];
    self.selectedTheme = @"Default";
}

- (void)setupSaveButton {
    UIBarButtonItem *saveButton = [[UIBarButtonItem alloc] initWithTitle:@"Save"
                                                                   style:UIBarButtonItemStyleDone
                                                                  target:self
                                                                  action:@selector(saveProfileChanges)];
    self.navigationItem.rightBarButtonItem = saveButton;
}

#pragma mark - UITableView DataSource

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 3; // Profile Picture, Personal Information, Theme
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    if (section == 0) return 1; // Profile Picture
    if (section == 1) return self.personalInfoFields.count; // Personal Information
    return 3; // Theme options (Default, Dark, Light)
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell"];
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"cell"];
    }
    
    if (indexPath.section == 0) {
        // Profile Picture Section
        if (!self.profileImageView) {
            self.profileImageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
            self.profileImageView.center = cell.contentView.center;
            self.profileImageView.layer.cornerRadius = 50;
            self.profileImageView.clipsToBounds = YES;
            self.profileImageView.image = [UIImage imageNamed:@"placeholder"]; // Default placeholder image
            self.profileImageView.userInteractionEnabled = YES;
            UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(presentImagePicker)];
            [self.profileImageView addGestureRecognizer:tapGesture];
        }
        [cell.contentView addSubview:self.profileImageView];
    } else if (indexPath.section == 1) {
        // Personal Information Section
        cell.textLabel.text = self.personalInfoFields[indexPath.row];
        UITextField *textField = [[UITextField alloc] initWithFrame:CGRectMake(150, 0, cell.contentView.frame.size.width - 160, cell.contentView.frame.size.height)];
        textField.placeholder = [NSString stringWithFormat:@"Enter %@", self.personalInfoFields[indexPath.row]];
        textField.text = self.personalInfoValues[indexPath.row];
        textField.tag = indexPath.row;
        [textField addTarget:self action:@selector(textFieldDidChange:) forControlEvents:UIControlEventEditingChanged];
        [cell.contentView addSubview:textField];
    } else {
        // Theme Selection Section
        NSArray *themes = @[@"Default", @"Dark", @"Light"];
        cell.textLabel.text = themes[indexPath.row];
        cell.accessoryType = [self.selectedTheme isEqualToString:themes[indexPath.row]] ? UITableViewCellAccessoryCheckmark : UITableViewCellAccessoryNone;
    }
    
    return cell;
}

#pragma mark - UITableView Delegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    if (indexPath.section == 2) {
        NSArray *themes = @[@"Default", @"Dark", @"Light"];
        self.selectedTheme = themes[indexPath.row];
        [[NSUserDefaults standardUserDefaults] setObject:self.selectedTheme forKey:@"selectedTheme"];
        [[NSUserDefaults standardUserDefaults] synchronize];
        [tableView reloadData];
    }
}

#pragma mark - Image Picker

- (void)presentImagePicker {
    UIImagePickerController *imagePicker = [[UIImagePickerController alloc] init];
    imagePicker.delegate = self;
    imagePicker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
    [self presentViewController:imagePicker animated:YES completion:nil];
}

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<UIImagePickerControllerInfoKey,id> *)info {
    UIImage *selectedImage = info[UIImagePickerControllerOriginalImage];
    self.profileImageView.image = selectedImage;
    [self dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark - Text Field Handler

- (void)textFieldDidChange:(UITextField *)textField {
    self.personalInfoValues[textField.tag] = textField.text;
}

#pragma mark - Save Profile Changes

- (void)saveProfileChanges {
    NSLog(@"Profile Picture: %@", self.profileImageView.image);
    NSLog(@"Personal Information: %@", self.personalInfoValues);
    NSLog(@"Selected Theme: %@", self.selectedTheme);
    // Add code to save profile changes to backend or local storage
}

@end
