import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database and notification functions
vi.mock("./db", () => ({
  createFormSubmission: vi.fn().mockResolvedValue({
    id: 1,
    businessName: "Test Business",
    businessType: "E-commerce",
    businessDuration: "2 years",
    businessLocation: "Mumbai",
    campaignGoal: "Leads",
    desiredAction: "Contact us",
    dailyBudget: "500",
    campaignDuration: "30",
    startDate: "2026-05-01",
    targetLocation: "5 KM radius",
    targetGender: "All",
    idealCustomer: "Young professionals",
    audienceInterests: "Tech enthusiasts",
    offering: "Online products",
    priceRange: "500-2000",
    usp: "Best quality",
    leadDirection: "WhatsApp",
    contactNumber: "+91 9876543210",
    leadManager: "John Doe",
    responseTime: "Immediate",
    previousAds: "Yes",
    pastResults: "Good results",
    customerDatabase: "Yes",
    customerDataFileUrl: "",
    facebookPage: "https://facebook.com/test",
    instagramPage: "https://instagram.com/test",
    website: "https://test.com",
    googleBusinessProfile: "https://google.com/test",
    availableCreatives: "Both",
    creativeMessage: "Great offer",
    adAccountType: "Business Owner Account",
    hasMetaBusinessManager: "Yes",
    facebookId: "test_id",
    facebookPassword: "test_pass",
    instagramUsername: "test_user",
    instagramPassword: "test_pass",
    reportingFrequency: "Weekly",
    successMetrics: "Lead generation",
    additionalNotes: "None",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./_core/emailService", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
}));

describe("form.submit", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
  });

  it("successfully submits form with all required fields", async () => {
    const caller = appRouter.createCaller(ctx);

    const formData = {
      businessName: "Test Business",
      businessType: "E-commerce",
      businessDuration: "2 years",
      businessLocation: "Mumbai",
      campaignGoal: "Leads",
      desiredAction: "Contact us",
      dailyBudget: "500",
      campaignDuration: "30",
      startDate: "2026-05-01",
      targetLocation: "5 KM radius",
      targetGender: "All",
      idealCustomer: "Young professionals",
      audienceInterests: "Tech enthusiasts",
      offering: "Online products",
      priceRange: "500-2000",
      usp: "Best quality",
      leadDirection: "WhatsApp",
      contactNumber: "+91 9876543210",
      leadManager: "John Doe",
      responseTime: "Immediate",
      previousAds: "Yes",
      pastResults: "Good results",
      customerDatabase: "Yes",
      customerDataFileUrl: "",
      facebookPage: "https://facebook.com/test",
      instagramPage: "https://instagram.com/test",
      website: "https://test.com",
      googleBusinessProfile: "https://google.com/test",
      availableCreatives: "Both",
      creativeMessage: "Great offer",
      adAccountType: "Business Owner Account",
      hasMetaBusinessManager: "Yes",
      facebookId: "test_id",
      facebookPassword: "test_pass",
      instagramUsername: "test_user",
      instagramPassword: "test_pass",
      reportingFrequency: "Weekly",
      successMetrics: "Lead generation",
      additionalNotes: "None",
    };

    const result = await caller.form.submit(formData);

    expect(result.success).toBe(true);
    expect(result.submissionId).toBe(1);
  });

  it("fails validation when required fields are missing", async () => {
    const caller = appRouter.createCaller(ctx);

    const incompleteData = {
      businessName: "",
      contactNumber: "",
      facebookPage: "",
      instagramPage: "",
    };

    try {
      await caller.form.submit(incompleteData as any);
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Business name is required");
    }
  });

  it("accepts optional fields as empty strings", async () => {
    const caller = appRouter.createCaller(ctx);

    const minimalData = {
      businessName: "Test Business",
      contactNumber: "+91 9876543210",
      facebookPage: "https://facebook.com/test",
      instagramPage: "https://instagram.com/test",
      businessType: "",
      businessDuration: "",
      businessLocation: "",
      campaignGoal: "",
      desiredAction: "",
      dailyBudget: "",
      campaignDuration: "",
      startDate: "",
      targetLocation: "",
      targetGender: "",
      idealCustomer: "",
      audienceInterests: "",
      offering: "",
      priceRange: "",
      usp: "",
      leadDirection: "",
      leadManager: "",
      responseTime: "",
      previousAds: "",
      pastResults: "",
      customerDatabase: "",
      customerDataFileUrl: "",
      website: "",
      googleBusinessProfile: "",
      availableCreatives: "",
      creativeMessage: "",
      adAccountType: "",
      hasMetaBusinessManager: "",
      facebookId: "",
      facebookPassword: "",
      instagramUsername: "",
      instagramPassword: "",
      reportingFrequency: "",
      successMetrics: "",
      additionalNotes: "",
    };

    const result = await caller.form.submit(minimalData);

    expect(result.success).toBe(true);
    expect(result.submissionId).toBe(1);
  });

  it("returns correct submission ID from database", async () => {
    const caller = appRouter.createCaller(ctx);

    const formData = {
      businessName: "Test Business",
      contactNumber: "+91 9876543210",
      facebookPage: "https://facebook.com/test",
      instagramPage: "https://instagram.com/test",
      businessType: "",
      businessDuration: "",
      businessLocation: "",
      campaignGoal: "",
      desiredAction: "",
      dailyBudget: "",
      campaignDuration: "",
      startDate: "",
      targetLocation: "",
      targetGender: "",
      idealCustomer: "",
      audienceInterests: "",
      offering: "",
      priceRange: "",
      usp: "",
      leadDirection: "",
      leadManager: "",
      responseTime: "",
      previousAds: "",
      pastResults: "",
      customerDatabase: "",
      customerDataFileUrl: "",
      website: "",
      googleBusinessProfile: "",
      availableCreatives: "",
      creativeMessage: "",
      adAccountType: "",
      hasMetaBusinessManager: "",
      facebookId: "",
      facebookPassword: "",
      instagramUsername: "",
      instagramPassword: "",
      reportingFrequency: "",
      successMetrics: "",
      additionalNotes: "",
    };

    const result = await caller.form.submit(formData);

    expect(result.submissionId).toBe(1);
  });
});
