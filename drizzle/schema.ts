import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Form submissions table for storing Meta Ads onboarding form data
 */
export const formSubmissions = mysqlTable("form_submissions", {
  id: int("id").autoincrement().primaryKey(),
  // Section 1: Business Information
  businessName: varchar("businessName", { length: 255 }).notNull(),
  businessType: varchar("businessType", { length: 255 }).notNull(),
  businessDuration: varchar("businessDuration", { length: 255 }).notNull(),
  businessLocation: varchar("businessLocation", { length: 255 }).notNull(),
  
  // Section 2: Campaign Objective
  campaignGoal: varchar("campaignGoal", { length: 255 }).notNull(),
  desiredAction: text("desiredAction").notNull(),
  
  // Section 3: Budget and Duration
  dailyBudget: varchar("dailyBudget", { length: 50 }).notNull(),
  campaignDuration: varchar("campaignDuration", { length: 50 }).notNull(),
  startDate: varchar("startDate", { length: 50 }).notNull(),
  
  // Section 4: Target Audience
  targetLocation: varchar("targetLocation", { length: 255 }).notNull(),
  targetAgeGroup: varchar("targetAgeGroup", { length: 255 }).notNull(),
  targetGender: varchar("targetGender", { length: 50 }).notNull(),
  idealCustomer: text("idealCustomer").notNull(),
  audienceInterests: text("audienceInterests").notNull(),
  
  // Section 5: Product/Service Details
  offering: text("offering").notNull(),
  priceRange: varchar("priceRange", { length: 255 }).notNull(),
  offersDiscounts: text("offersDiscounts").notNull(),
  usp: text("usp").notNull(),
  
  // Section 6: Lead Handling
  leadDirection: varchar("leadDirection", { length: 255 }).notNull(),
  contactNumber: varchar("contactNumber", { length: 20 }).notNull(),
  leadManager: varchar("leadManager", { length: 255 }).notNull(),
  responseTime: varchar("responseTime", { length: 255 }).notNull(),
  
  // Section 7: Previous Advertising Data
  previousAds: varchar("previousAds", { length: 10 }).notNull(),
  pastResults: text("pastResults"),
  customerDatabase: varchar("customerDatabase", { length: 10 }).notNull(),
  
  // Section 8: Online Presence
  facebookPage: varchar("facebookPage", { length: 500 }),
  instagramPage: varchar("instagramPage", { length: 500 }),
  website: varchar("website", { length: 500 }),
  googleBusinessProfile: varchar("googleBusinessProfile", { length: 500 }),
  
  // Section 9: Creatives
  availableCreatives: varchar("availableCreatives", { length: 255 }).notNull(),
  needNewCreatives: varchar("needNewCreatives", { length: 10 }).notNull(),
  creativeMessage: text("creativeMessage").notNull(),
  
  // Section 10: Access and Permissions
  adAccountType: varchar("adAccountType", { length: 255 }).notNull(),
  hasMetaBusinessManager: varchar("hasMetaBusinessManager", { length: 10 }).notNull(),
  adAccountAccess: varchar("adAccountAccess", { length: 255 }).notNull(),
  facebookPageAccess: varchar("facebookPageAccess", { length: 255 }).notNull(),
  instagramAccountAccess: varchar("instagramAccountAccess", { length: 255 }).notNull(),
  
  // Section 11: Reporting and Expectations
  reportingFrequency: varchar("reportingFrequency", { length: 255 }).notNull(),
  successMetrics: text("successMetrics").notNull(),
  
  // Section 12: Additional Notes
  additionalNotes: text("additionalNotes"),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertFormSubmission = typeof formSubmissions.$inferInsert;