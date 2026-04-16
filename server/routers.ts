import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createFormSubmission } from "./db";
import { notifyOwner } from "./_core/notification";

const formSubmissionSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  businessDuration: z.string().min(1, "Business duration is required"),
  businessLocation: z.string().min(1, "Business location is required"),
  campaignGoal: z.string().min(1, "Campaign goal is required"),
  desiredAction: z.string().min(1, "Desired action is required"),
  dailyBudget: z.string().min(1, "Daily budget is required"),
  campaignDuration: z.string().min(1, "Campaign duration is required"),
  startDate: z.string().min(1, "Start date is required"),
  targetLocation: z.string().min(1, "Target location is required"),
  targetAgeGroup: z.string().min(1, "Target age group is required"),
  targetGender: z.string().min(1, "Target gender is required"),
  idealCustomer: z.string().min(1, "Ideal customer description is required"),
  audienceInterests: z.string().min(1, "Audience interests are required"),
  offering: z.string().min(1, "Offering description is required"),
  priceRange: z.string().min(1, "Price range is required"),
  offersDiscounts: z.string().min(1, "Offers/discounts information is required"),
  usp: z.string().min(1, "USP is required"),
  leadDirection: z.string().min(1, "Lead direction is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  leadManager: z.string().min(1, "Lead manager name is required"),
  responseTime: z.string().min(1, "Response time is required"),
  previousAds: z.string().min(1, "Previous ads information is required"),
  pastResults: z.string().optional(),
  customerDatabase: z.string().min(1, "Customer database information is required"),
  facebookPage: z.string().optional(),
  instagramPage: z.string().optional(),
  website: z.string().optional(),
  googleBusinessProfile: z.string().optional(),
  availableCreatives: z.string().min(1, "Available creatives is required"),
  needNewCreatives: z.string().min(1, "New creatives requirement is required"),
  creativeMessage: z.string().min(1, "Creative message is required"),
  adAccountType: z.string().min(1, "Ad account type is required"),
  hasMetaBusinessManager: z.string().min(1, "Meta Business Manager information is required"),
  adAccountAccess: z.string().min(1, "Ad account access is required"),
  facebookPageAccess: z.string().min(1, "Facebook page access is required"),
  instagramAccountAccess: z.string().min(1, "Instagram account access is required"),
  reportingFrequency: z.string().min(1, "Reporting frequency is required"),
  successMetrics: z.string().min(1, "Success metrics are required"),
  additionalNotes: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  form: router({
    submit: publicProcedure
      .input(formSubmissionSchema)
      .mutation(async ({ input }) => {
        // Store submission in database
        const submission = await createFormSubmission(input);

        // Format notification content with structured sections
        const notificationContent = `
**Section 1: Business Information**
- Business Name: ${input.businessName}
- Business Type: ${input.businessType}
- Duration in Market: ${input.businessDuration}
- Location: ${input.businessLocation}

**Section 2: Campaign Objective**
- Primary Goal: ${input.campaignGoal}
- Desired Action: ${input.desiredAction}

**Section 3: Budget and Duration**
- Daily Budget (INR): ${input.dailyBudget}
- Campaign Duration (days): ${input.campaignDuration}
- Start Date: ${input.startDate}

**Section 4: Target Audience**
- Target Location: ${input.targetLocation}
- Age Group: ${input.targetAgeGroup}
- Gender: ${input.targetGender}
- Ideal Customer: ${input.idealCustomer}
- Interests/Behaviors: ${input.audienceInterests}

**Section 5: Product/Service Details**
- Offering: ${input.offering}
- Price Range: ${input.priceRange}
- Offers/Discounts: ${input.offersDiscounts}
- USP: ${input.usp}

**Section 6: Lead Handling**
- Lead Direction: ${input.leadDirection}
- Contact Number: ${input.contactNumber}
- Lead Manager: ${input.leadManager}
- Expected Response Time: ${input.responseTime}

**Section 7: Previous Advertising Data**
- Previous Ads: ${input.previousAds}
- Past Results: ${input.pastResults || "N/A"}
- Customer Database: ${input.customerDatabase}

**Section 8: Online Presence**
- Facebook Page: ${input.facebookPage || "N/A"}
- Instagram Page: ${input.instagramPage || "N/A"}
- Website: ${input.website || "N/A"}
- Google Business Profile: ${input.googleBusinessProfile || "N/A"}

**Section 9: Creatives**
- Available Creatives: ${input.availableCreatives}
- Need New Creatives: ${input.needNewCreatives}
- Creative Message/Angle: ${input.creativeMessage}

**Section 10: Access and Permissions**
- Ad Account Type: ${input.adAccountType}
- Has Meta Business Manager: ${input.hasMetaBusinessManager}
- Ad Account Access: ${input.adAccountAccess}
- Facebook Page Access: ${input.facebookPageAccess}
- Instagram Account Access: ${input.instagramAccountAccess}

**Section 11: Reporting and Expectations**
- Reporting Frequency: ${input.reportingFrequency}
- Success Metrics: ${input.successMetrics}

**Section 12: Additional Notes**
${input.additionalNotes || "No additional notes"}
        `;

        // Send notification to owner
        await notifyOwner({
          title: "New Meta Ads Onboarding Form Submission",
          content: notificationContent,
        });

        return {
          success: true,
          submissionId: submission.id,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
