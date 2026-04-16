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
- [ ] Change overall theme/color palette (away from transcendent lavender/blush)
- [ ] Update typography and visual styling

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
- [ ] Update schema to remove deleted fields
- [ ] Update schema to add file upload field for customer data
- [ ] Update tRPC validation schema
- [ ] Update email template to reflect new field names and structure

### Frontend
- [ ] Update OnboardingForm component with new field labels
- [ ] Add file upload input for Section 7
- [ ] Update validation to make Facebook and Instagram links required
- [ ] Remove deleted fields from form
- [ ] Update form submission logic to handle file uploads

### Testing
- [ ] Update tests to reflect new required fields and removed fields
- [ ] Test file upload functionality
- [ ] Verify email template shows correct field labels
