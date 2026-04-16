import { describe, expect, it, vi, beforeEach } from "vitest";
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
    targetAgeGroup: "25-34",
    targetGender: "All",
    idealCustomer: "Young professionals",
    audienceInterests: "Tech enthusiasts",
    offering: "Online products",
    priceRange: "500-2000",
    offersDiscounts: "10% discount",
    usp: "Best quality",
    leadDirection: "WhatsApp",
    contactNumber: "+91 9876543210",
    leadManager: "John Doe",
    responseTime: "Immediate",
    previousAds: "Yes",
    pastResults: "Good results",
    customerDatabase: "Yes",
    facebookPage: "https://facebook.com/test",
    instagramPage: "https://instagram.com/test",
    website: "https://test.com",
    googleBusinessProfile: "https://google.com/test",
    availableCreatives: "Both",
    needNewCreatives: "No",
    creativeMessage: "Great offer",
    adAccountType: "Business Owner Account",
    hasMetaBusinessManager: "Yes",
    adAccountAccess: "Admin",
    facebookPageAccess: "Admin",
    instagramAccountAccess: "Admin",
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
      targetAgeGroup: "25-34",
      targetGender: "All",
      idealCustomer: "Young professionals",
      audienceInterests: "Tech enthusiasts",
      offering: "Online products",
      priceRange: "500-2000",
      offersDiscounts: "10% discount",
      usp: "Best quality",
      leadDirection: "WhatsApp",
      contactNumber: "+91 9876543210",
      leadManager: "John Doe",
      responseTime: "Immediate",
      previousAds: "Yes",
      pastResults: "Good results",
      customerDatabase: "Yes",
      facebookPage: "https://facebook.com/test",
      instagramPage: "https://instagram.com/test",
      website: "https://test.com",
      googleBusinessProfile: "https://google.com/test",
      availableCreatives: "Both",
      needNewCreatives: "No",
      creativeMessage: "Great offer",
      adAccountType: "Business Owner Account",
      hasMetaBusinessManager: "Yes",
      adAccountAccess: "Admin",
      facebookPageAccess: "Admin",
      instagramAccountAccess: "Admin",
      reportingFrequency: "Weekly",
      successMetrics: "Lead generation",
      additionalNotes: "None",
    };

    const result = await caller.form.submit(formData);

    expect(result).toEqual({
      success: true,
      submissionId: 1,
    });
  });

  it("fails validation when required fields are missing", async () => {
    const caller = appRouter.createCaller(ctx);

    const incompleteFormData = {
      businessName: "",
      businessType: "",
      businessDuration: "",
      businessLocation: "",
      campaignGoal: "",
      desiredAction: "",
      dailyBudget: "",
      campaignDuration: "",
      startDate: "",
      targetLocation: "",
      targetAgeGroup: "",
      targetGender: "",
      idealCustomer: "",
      audienceInterests: "",
      offering: "",
      priceRange: "",
      offersDiscounts: "",
      usp: "",
      leadDirection: "",
      contactNumber: "",
      leadManager: "",
      responseTime: "",
      previousAds: "",
      pastResults: "",
      customerDatabase: "",
      facebookPage: "",
      instagramPage: "",
      website: "",
      googleBusinessProfile: "",
      availableCreatives: "",
      needNewCreatives: "",
      creativeMessage: "",
      adAccountType: "",
      hasMetaBusinessManager: "",
      adAccountAccess: "",
      facebookPageAccess: "",
      instagramAccountAccess: "",
      reportingFrequency: "",
      successMetrics: "",
      additionalNotes: "",
    };

    try {
      await caller.form.submit(incompleteFormData);
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("accepts optional fields as empty strings", async () => {
    const caller = appRouter.createCaller(ctx);

    const formDataWithOptionals = {
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
      targetAgeGroup: "25-34",
      targetGender: "All",
      idealCustomer: "Young professionals",
      audienceInterests: "Tech enthusiasts",
      offering: "Online products",
      priceRange: "500-2000",
      offersDiscounts: "10% discount",
      usp: "Best quality",
      leadDirection: "WhatsApp",
      contactNumber: "+91 9876543210",
      leadManager: "John Doe",
      responseTime: "Immediate",
      previousAds: "Yes",
      pastResults: "", // Optional
      customerDatabase: "Yes",
      facebookPage: "", // Optional
      instagramPage: "", // Optional
      website: "", // Optional
      googleBusinessProfile: "", // Optional
      availableCreatives: "Both",
      needNewCreatives: "No",
      creativeMessage: "Great offer",
      adAccountType: "Business Owner Account",
      hasMetaBusinessManager: "Yes",
      adAccountAccess: "Admin",
      facebookPageAccess: "Admin",
      instagramAccountAccess: "Admin",
      reportingFrequency: "Weekly",
      successMetrics: "Lead generation",
      additionalNotes: "", // Optional
    };

    const result = await caller.form.submit(formDataWithOptionals);

    expect(result.success).toBe(true);
    expect(result.submissionId).toBe(1);
  });

  it("returns correct submission ID from database", async () => {
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
      targetAgeGroup: "25-34",
      targetGender: "All",
      idealCustomer: "Young professionals",
      audienceInterests: "Tech enthusiasts",
      offering: "Online products",
      priceRange: "500-2000",
      offersDiscounts: "10% discount",
      usp: "Best quality",
      leadDirection: "WhatsApp",
      contactNumber: "+91 9876543210",
      leadManager: "John Doe",
      responseTime: "Immediate",
      previousAds: "Yes",
      pastResults: "Good results",
      customerDatabase: "Yes",
      facebookPage: "https://facebook.com/test",
      instagramPage: "https://instagram.com/test",
      website: "https://test.com",
      googleBusinessProfile: "https://google.com/test",
      availableCreatives: "Both",
      needNewCreatives: "No",
      creativeMessage: "Great offer",
      adAccountType: "Business Owner Account",
      hasMetaBusinessManager: "Yes",
      adAccountAccess: "Admin",
      facebookPageAccess: "Admin",
      instagramAccountAccess: "Admin",
      reportingFrequency: "Weekly",
      successMetrics: "Lead generation",
      additionalNotes: "None",
    };

    const result = await caller.form.submit(formData);

    expect(result.submissionId).toBeDefined();
    expect(typeof result.submissionId).toBe("number");
    expect(result.submissionId).toBeGreaterThan(0);
  });
});
