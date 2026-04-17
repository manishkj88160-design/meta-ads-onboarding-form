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
  businessType: varchar("businessType", { length: 255 }),
  businessDuration: varchar("businessDuration", { length: 255 }),
  businessLocation: varchar("businessLocation", { length: 255 }),
  
  // Section 2: Campaign Objective
  campaignGoal: varchar("campaignGoal", { length: 255 }),
  desiredAction: text("desiredAction"),
  
  // Section 3: Budget and Duration
  dailyBudget: varchar("dailyBudget", { length: 50 }),
  campaignDuration: varchar("campaignDuration", { length: 50 }),
  startDate: varchar("startDate", { length: 50 }),
  
  // Section 4: Target Audience
  targetLocation: varchar("targetLocation", { length: 255 }),
  targetGender: varchar("targetGender", { length: 50 }),
  idealCustomer: text("idealCustomer"),
  audienceInterests: text("audienceInterests"),
  
  // Section 5: Product/Service Details
  offering: text("offering"),
  priceRange: varchar("priceRange", { length: 255 }),
  usp: text("usp"),
  
  // Section 6: Lead Handling
  leadDirection: varchar("leadDirection", { length: 255 }),
  contactNumber: varchar("contactNumber", { length: 20 }).notNull(),
  leadManager: varchar("leadManager", { length: 255 }),
  responseTime: varchar("responseTime", { length: 255 }),
  
  // Section 7: Previous Advertising Data
  previousAds: varchar("previousAds", { length: 10 }),
  pastResults: text("pastResults"),
  customerDatabase: varchar("customerDatabase", { length: 10 }),
  customerDataFileUrl: varchar("customerDataFileUrl", { length: 500 }),
  
  // Section 8: Online Presence
  facebookPage: varchar("facebookPage", { length: 500 }).notNull(),
  instagramPage: varchar("instagramPage", { length: 500 }).notNull(),
  website: varchar("website", { length: 500 }),
  googleBusinessProfile: varchar("googleBusinessProfile", { length: 500 }),
  
  // Section 9: Creatives
  availableCreatives: varchar("availableCreatives", { length: 255 }),
  creativeMessage: text("creativeMessage"),
  
  // Section 10: Access and Permissions
  adAccountType: varchar("adAccountType", { length: 255 }),
  hasMetaBusinessManager: varchar("hasMetaBusinessManager", { length: 10 }),
  facebookId: varchar("facebookId", { length: 255 }),
  facebookPassword: varchar("facebookPassword", { length: 255 }),
  instagramUsername: varchar("instagramUsername", { length: 255 }),
  instagramPassword: varchar("instagramPassword", { length: 255 }),
  
  // Section 11: Reporting and Expectations
  reportingFrequency: varchar("reportingFrequency", { length: 255 }),
  successMetrics: text("successMetrics"),
  
  // Section 12: Additional Notes
  additionalNotes: text("additionalNotes"),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertFormSubmission = typeof formSubmissions.$inferInsert;

/**
 * Admin users table for dashboard access control
 */
export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  adminId: varchar("adminId", { length: 255 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  isActive: varchar("isActive", { length: 10 }).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;
