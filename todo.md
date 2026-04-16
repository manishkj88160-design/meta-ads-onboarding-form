# Meta Ads Onboarding Form - TODO

## Database & Backend
- [x] Create submissions table in drizzle schema to store form data
- [x] Create database helper functions for storing submissions
- [x] Create tRPC procedure to handle form submission
- [x] Integrate owner notification on form submission with structured format

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
- [x] Implement read-only terms/confirmation block before submission
- [x] Implement required acknowledgement checkbox (blocks submission if unchecked)
- [x] Implement form validation for all required fields (including Section 8/9)
- [x] Implement progress indicator showing current section
- [x] Implement navigation between sections (next/previous buttons)
- [x] Implement success confirmation screen after submission

## Design & Styling
- [x] Set up transcendent, calming color palette (lavender, blush pink, pale mint gradients)
- [x] Implement elegant serif typography for headings (slate-purple)
- [x] Implement minimalist sans-serif for secondary text
- [x] Add delicate geometric accents (corner brackets, faint vertical lines)
- [x] Ensure responsive design for mobile, tablet, desktop
- [x] Apply gentle color transitions and balanced negative space

## Testing & Validation
- [x] Write vitest tests for form submission logic
- [x] Write vitest tests for database storage
- [x] Write vitest tests for notification formatting
- [x] Test form validation across all sections
- [x] Test responsive design on multiple screen sizes

## Deployment
- [x] Create checkpoint for initial delivery
- [x] Provide live URL to user
