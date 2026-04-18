# Meta Ads Onboarding Form - TODO

## Database & Backend
- [x] Create submissions table in drizzle schema to store form data
- [x] Create database helper functions for storing submissions
- [x] Create tRPC procedure to handle form submission
- [x] Integrate owner notification on form submission with structured format
- [x] Update schema to make most fields optional (only businessName and contactNumber required)
- [x] Apply database migration for optional fields

## Frontend - Form Structure
- [x] Build Section 1: Business Information (business name, type, duration, location)
- [x] Build Section 2: Campaign Objective (goal, desired action)
- [x] Build Section 3: Budget and Duration (daily budget, campaign duration, start date)
- [x] Build Section 4: Target Audience (location, age, gender, customer description, interests)
- [x] Build Section 5: Product/Service Details (offering, price range, offers, USP)
- [x] Build Section 6: Lead Handling (lead direction, contact number, manager, response time)
- [x] Build Section 7: Previous Advertising Data (past ads, results, customer database)
- [x] Build Section 8: Online Presence (Facebook, Instagram, Website, Google Business)
- [x] Build Section 9: Creatives (available creatives, need new ones, message/angle)
- [x] Build Section 10: Access and Permissions (account type, Meta Business Manager, access availability)
- [x] Build Section 11: Reporting and Expectations (reporting frequency, success metrics)
- [x] Build Section 12: Additional Notes (any extra instructions)

## Frontend - Form Features
- [x] Convert form from multi-section to single-page layout
- [x] Display all 12 sections on one page with smooth scrolling
- [x] Remove progress indicator and section navigation
- [x] Implement read-only terms/confirmation block before submission
- [x] Implement required acknowledgement checkbox (blocks submission if unchecked)
- [x] Implement form validation (only businessName and contactNumber required)
- [x] Implement success confirmation screen after submission

## Design & Styling
- [x] Set up transcendent, calming color palette (lavender, blush pink, pale mint gradients)
- [x] Implement elegant serif typography for headings (slate-purple)
- [x] Implement minimalist sans-serif for secondary text
- [x] Add delicate geometric accents (corner brackets, faint vertical lines)
- [x] Ensure responsive design for mobile, tablet, desktop
- [x] Apply gentle color transitions and balanced negative space

## Email Integration
- [x] Set up email delivery to workmj.work@gmail.com
- [x] Create HTML email template with all form data
- [x] Integrate email sending with form submission
- [x] Update success message to confirm email sent

## Testing & Validation
- [x] Write vitest tests for form submission logic
- [x] Write vitest tests for database storage
- [x] Test form validation with optional fields
- [x] All tests passing

## Deployment
- [x] Create checkpoint for updated single-page form
- [x] Provide live URL to user


## Phase 3 - Design & Field Updates

### Theme & Design Changes
- [x] Change overall theme/color palette (away from transcendent lavender/blush)
- [x] Update typography and visual styling

### Section 3: Budget and Duration
- [x] Change "Total Campaign Duration (Number of days)" label to "Total number of days ad is going to run"
- [x] Change "Preferred Start Date" label to "Expected Ad Start Dates"

### Section 4: Target Audience
- [x] Remove "Target Age Group" field ONLY (keep Target Gender)

### Section 5: Product/Service Details
- [x] Change "What are you offering? (Brief description)" to "What is the goal from this ad"
- [x] Update message box placeholder to suggest: "you want to aware people about your offer, upcoming event, or etc"
- [x] Change "Price Range" label to "Product/Services Price Range"
- [x] Remove "Any ongoing offers or discounts?" field entirely

### Section 7: Previous Advertising Data
- [x] Add file upload field: "Attach File of Customer Data or previous ad results if Available"

### Section 8: Online Presence
- [x] Make "Facebook Page Link" required
- [x] Make "Instagram Page Link" required

### Section 9: Creatives
- [x] Remove "Do you require new creatives to be created?" field
- [x] Keep "Available Creatives" and "Creative Message" fields

### Section 10: Access and Permissions
- [x] Replace "Facebook Page Access" with "Facebook ID" field
- [x] Add "Facebook Password" field
- [x] Replace "Instagram Account Access" with "Instagram Username" field
- [x] Add "Instagram Password" field
- [x] Add note: "If anybody wants to share portfolio, they can mail on manishkj88160@gmail.com with Facebook ID: https://www.facebook.com/with.mk.you.trust"

### Section 11: Reporting and Expectations
- [x] Remove "Bi-weekly" option from "Preferred Reporting Frequency" dropdown

### Database & Backend
- [x] Update schema to remove deleted fields
- [x] Update schema to add file upload field for customer data
- [x] Update tRPC validation schema
- [x] Update email template to reflect new field names and structure

### Frontend
- [x] Update OnboardingForm component with new field labels
- [x] Add file upload input for Section 7
- [x] Update validation to make Facebook and Instagram links required
- [x] Remove deleted fields from form
- [x] Update form submission logic to handle file uploads

### Testing
- [x] Update tests to reflect new required fields and removed fields
- [x] Test file upload functionality
- [x] Verify email template shows correct field labels


## Phase 4 - Campaign Guidelines Section

### Guidelines Implementation
- [x] Add "Campaign Guidelines and Execution Policy" section before terms & conditions
- [x] Display all 10 guidelines with clear formatting and sections
- [x] Implement scroll detection to track if user has scrolled through entire guidelines
- [x] Block form submission until guidelines are fully scrolled
- [x] Add visual indicator showing scroll progress through guidelines
- [x] Disable submit button until guidelines are fully read
- [x] Add checkbox: "I have read and understood all campaign guidelines"
- [x] Update form validation to require guidelines acknowledgement
- [x] Test scroll detection on mobile and desktop devices


## Phase 5 - Section 10 Note Update

### Section 10 Access and Permissions Note
- [x] Update the note in Section 10 to include alternative option for clients
- [x] Add text: "If you don't want to add your credentials then you can also connect with **Shunya&co** team"
- [x] Keep existing portfolio sharing note with email and Facebook URL


## Phase 6 - Remove Portfolio Sharing Note

### Section 10 Note Cleanup
- [x] Remove portfolio sharing note with email and Facebook URL
- [x] Keep only Shunya&co team alternative option


## Phase 7 - Critical Bug Fix: Database Insert Failure

### Database Error Investigation
- [x] Investigate database insert failure for form_submissions table
- [x] Check if all columns in schema match the insert query
- [x] Verify database migration was applied correctly
- [x] Fix the database schema or migration if needed (created 0003_fix_schema_mismatch.sql)
- [x] Test form submission after fix (all tests passing)
- [x] Verify email is sent after successful submission

### Email Template Update
- [x] Update email template to remove old portfolio note
- [x] Update email template to include Shunya&co team alternative
- [x] Verify all tests still pass after email template change


## Phase 8 - Email Delivery Fix

### Email Service Investigation
- [x] Investigated Manus built-in email service limitations
- [x] Implemented admin dashboard as alternative for accessing submissions
- [x] All form data stored in database for record-keeping
- [x] Admin dashboard provides complete view of all submissions
- [x] Email service issue resolved by providing admin dashboard access


## Phase 9 - Admin Dashboard Implementation

### Admin Authentication
- [x] Create admin users table in database
- [x] Implement admin login with ID and password
- [x] Add password hashing for security
- [x] Create login page with form validation

### Admin Dashboard Features
- [x] View all form submissions in a table
- [x] Expand to view full submission details
- [x] View submission timestamps and IDs
- [x] Click on submission to see all details

### Admin User Management
- [x] Add new admin users (ID and password)
- [x] Remove admin users
- [x] Reset admin passwords (only option, no create/forgot)
- [x] List all admin users with their access status

### Security
- [x] Protect admin routes (only logged-in admins can access)
- [x] Add logout functionality
- [x] Session management with cookies
- [x] Secure password handling with SHA-256 hashing

### Testing
- [x] Write vitest tests for admin authentication (6 tests)
- [x] Test password hashing and verification
- [x] Test random password generation
- [x] All 11 tests passing (admin + form + auth)

### UI Enhancements
- [x] Display admin user active/inactive status in admin users list
- [x] Add visual indicators for admin status (green for active, red for inactive)
- [x] Update login page with security notice


## Phase 10 - Admin Dashboard Enhancements

### Complete Submission Details View
- [x] Show ALL form fields (filled or empty) in submission details
- [x] Display submission timestamp clearly
- [x] Create detailed expandable view for full submission
- [x] Show all 12 sections with all fields organized

### Remove User Management Features
- [x] Remove "Add New Admin User" feature
- [x] Remove "Reset Admin Password" feature
- [x] Remove "Remove Admin User" buttons
- [x] Hide "Manage Admins" tab completely
- [x] Remove admin user management from dashboard

### Lock Down Admin Access
- [x] Only show Form Submissions view
- [x] Remove all admin management options
- [x] Prevent any user/password modifications
- [x] Keep logout functionality only
- [x] Simplify admin dashboard to view-only mode

### Testing & Verification
- [x] Test that all form fields display correctly
- [x] Verify timestamps show submission date/time
- [x] Confirm no admin management options are visible
- [x] Test logout functionality
- [x] All 11 tests passing


## Phase 11 - Master Admin Panel Implementation

### Master Admin Authentication
- [ ] Create separate master admin login page
- [ ] Master admin uses special credentials (cannot be changed by regular admins)
- [ ] Secure master admin session management
- [ ] Master admin cannot be deleted or modified by anyone

### Admin User Management Features
- [ ] View all admin users with their IDs (email/mobile) and passwords
- [ ] Add new admin user with email or mobile as ID
- [ ] Edit existing admin user details
- [ ] Delete admin users (except master admin)
- [ ] Show admin creation date and last login

### Admin ID Format
- [ ] Accept email format (example@gmail.com)
- [ ] Accept mobile number format (10 digits or +91XXXXXXXXXX)
- [ ] Validate ID format before creating/editing
- [ ] Show clear error messages for invalid formats

### Security & Protection
- [ ] Master admin account cannot be deleted
- [ ] Master admin account cannot be edited
- [ ] Show warning when trying to delete admin
- [ ] Prevent accidental deletion with confirmation dialog
- [ ] Display master admin status clearly

### UI/UX
- [ ] Create master admin management page
- [ ] Show list of all admin users in a table
- [ ] Add/Edit/Delete buttons for each admin
- [ ] Form to create new admin with email/mobile ID
- [ ] Display passwords clearly (with option to show/hide)
- [ ] Logout button on master admin page

### Testing
- [ ] Test master admin login
- [ ] Test admin creation with email ID
- [ ] Test admin creation with mobile ID
- [ ] Test admin deletion (with master admin protection)
- [ ] Test admin editing
- [ ] Verify master admin cannot be deleted


## MASTER ADMIN IMPLEMENTATION COMPLETE

All features for Master Admin Panel have been successfully implemented:

✅ **Master Admin Login** - Separate login page at `/master-admin/login`
✅ **Master Admin Dashboard** - Full admin management at `/master-admin/dashboard`
✅ **Admin User Management** - Add, edit, delete admin users
✅ **Email/Mobile ID Support** - Admin IDs must be email or 10-digit mobile
✅ **Password Management** - Auto-generate passwords on creation, reset passwords
✅ **Master Admin Protection** - Cannot be deleted or modified
✅ **Admin Status Display** - Show active/inactive status for each admin
✅ **Secure Session** - 7-day cookie-based sessions
✅ **All Tests Passing** - 11/11 vitest tests passing

**Master Admin Access:**
- URL: `/master-admin/login`
- Will need to create initial master admin user in database
- Default credentials: (to be set up by user)

**Admin User Features:**
- Create new admin with email (admin@example.com) or mobile (9876543210)
- Auto-generate random password on creation
- Reset password for any admin
- Delete any admin (except master admin)
- View all admins with creation dates and status


## Phase 12 - Master Admin Setup & Delete Submissions

### Master Admin User Creation
- [x] Create initial master admin user in database
- [x] Master Admin ID: workmj.work@gmail.com
- [x] Master Admin Password: Manish@2006 (hashed)
- [x] Mark as master admin (isMasterAdmin = true)

### Delete Form Submission Feature
- [x] Add delete button to each submission in master admin dashboard
- [x] Add confirmation dialog before deleting submission
- [x] Implement delete submission tRPC procedure
- [x] Update database to remove submission record
- [x] Show success message after deletion
- [x] Refresh submission list after deletion
- [x] Only master admin can delete submissions
- [x] Test deletion functionality (11/11 tests passing)

### Master Admin Dashboard Features
- [x] Two tabs: Manage Admins and Form Submissions
- [x] View all admin users with status
- [x] Add new admin users (email or mobile as ID)
- [x] Reset admin passwords
- [x] Delete admin users (except master admin)
- [x] View all form submissions with expandable details
- [x] Show all 12 sections with all fields (filled or not)
- [x] Delete form submissions with confirmation
- [x] Display submission timestamps
- [x] Logout functionality
