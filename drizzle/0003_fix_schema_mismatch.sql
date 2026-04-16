-- Drop old columns that no longer exist in schema
ALTER TABLE `form_submissions` DROP COLUMN IF EXISTS `targetAgeGroup`;
ALTER TABLE `form_submissions` DROP COLUMN IF EXISTS `offersDiscounts`;
ALTER TABLE `form_submissions` DROP COLUMN IF EXISTS `needNewCreatives`;
ALTER TABLE `form_submissions` DROP COLUMN IF EXISTS `adAccountAccess`;
ALTER TABLE `form_submissions` DROP COLUMN IF EXISTS `facebookPageAccess`;
ALTER TABLE `form_submissions` DROP COLUMN IF EXISTS `instagramAccountAccess`;

-- Add new columns that are in the current schema
ALTER TABLE `form_submissions` ADD COLUMN IF NOT EXISTS `customerDataFileUrl` varchar(500);
ALTER TABLE `form_submissions` ADD COLUMN IF NOT EXISTS `facebookId` varchar(255);
ALTER TABLE `form_submissions` ADD COLUMN IF NOT EXISTS `facebookPassword` varchar(255);
ALTER TABLE `form_submissions` ADD COLUMN IF NOT EXISTS `instagramUsername` varchar(255);
ALTER TABLE `form_submissions` ADD COLUMN IF NOT EXISTS `instagramPassword` varchar(255);

-- Make previously NOT NULL columns nullable to match schema
ALTER TABLE `form_submissions` MODIFY COLUMN `businessType` varchar(255);
ALTER TABLE `form_submissions` MODIFY COLUMN `businessDuration` varchar(255);
ALTER TABLE `form_submissions` MODIFY COLUMN `businessLocation` varchar(255);
ALTER TABLE `form_submissions` MODIFY COLUMN `campaignGoal` varchar(255);
ALTER TABLE `form_submissions` MODIFY COLUMN `desiredAction` text;
ALTER TABLE `form_submissions` MODIFY COLUMN `dailyBudget` varchar(50);
ALTER TABLE `form_submissions` MODIFY COLUMN `campaignDuration` varchar(50);
ALTER TABLE `form_submissions` MODIFY COLUMN `startDate` varchar(50);
ALTER TABLE `form_submissions` MODIFY COLUMN `targetLocation` varchar(255);
ALTER TABLE `form_submissions` MODIFY COLUMN `targetGender` varchar(50);
ALTER TABLE `form_submissions` MODIFY COLUMN `idealCustomer` text;
ALTER TABLE `form_submissions` MODIFY COLUMN `audienceInterests` text;
ALTER TABLE `form_submissions` MODIFY COLUMN `offering` text;
ALTER TABLE `form_submissions` MODIFY COLUMN `priceRange` varchar(255);
ALTER TABLE `form_submissions` MODIFY COLUMN `usp` text;
ALTER TABLE `form_submissions` MODIFY COLUMN `leadDirection` varchar(255);
ALTER TABLE `form_submissions` MODIFY COLUMN `leadManager` varchar(255);
ALTER TABLE `form_submissions` MODIFY COLUMN `responseTime` varchar(255);
ALTER TABLE `form_submissions` MODIFY COLUMN `previousAds` varchar(10);
ALTER TABLE `form_submissions` MODIFY COLUMN `customerDatabase` varchar(10);
ALTER TABLE `form_submissions` MODIFY COLUMN `availableCreatives` varchar(255);
ALTER TABLE `form_submissions` MODIFY COLUMN `creativeMessage` text;
ALTER TABLE `form_submissions` MODIFY COLUMN `adAccountType` varchar(255);
ALTER TABLE `form_submissions` MODIFY COLUMN `hasMetaBusinessManager` varchar(10);
ALTER TABLE `form_submissions` MODIFY COLUMN `reportingFrequency` varchar(255);
ALTER TABLE `form_submissions` MODIFY COLUMN `successMetrics` text;
