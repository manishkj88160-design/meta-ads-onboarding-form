import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createFormSubmission } from "./db";
import { notifyOwner } from "./_core/notification";
import { sendEmail } from "./_core/emailService";

const formSubmissionSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().optional(),
  businessDuration: z.string().optional(),
  businessLocation: z.string().optional(),
  campaignGoal: z.string().optional(),
  desiredAction: z.string().optional(),
  dailyBudget: z.string().optional(),
  campaignDuration: z.string().optional(),
  startDate: z.string().optional(),
  targetLocation: z.string().optional(),
  targetAgeGroup: z.string().optional(),
  targetGender: z.string().optional(),
  idealCustomer: z.string().optional(),
  audienceInterests: z.string().optional(),
  offering: z.string().optional(),
  priceRange: z.string().optional(),
  offersDiscounts: z.string().optional(),
  usp: z.string().optional(),
  leadDirection: z.string().optional(),
  contactNumber: z.string().min(1, "Contact number is required"),
  leadManager: z.string().optional(),
  responseTime: z.string().optional(),
  previousAds: z.string().optional(),
  pastResults: z.string().optional(),
  customerDatabase: z.string().optional(),
  facebookPage: z.string().optional(),
  instagramPage: z.string().optional(),
  website: z.string().optional(),
  googleBusinessProfile: z.string().optional(),
  availableCreatives: z.string().optional(),
  needNewCreatives: z.string().optional(),
  creativeMessage: z.string().optional(),
  adAccountType: z.string().optional(),
  hasMetaBusinessManager: z.string().optional(),
  adAccountAccess: z.string().optional(),
  facebookPageAccess: z.string().optional(),
  instagramAccountAccess: z.string().optional(),
  reportingFrequency: z.string().optional(),
  successMetrics: z.string().optional(),
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

        // Format email content with structured sections
        const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d4c5e2 0%, #c8b8d8 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .section { margin-bottom: 25px; border-left: 4px solid #d4c5e2; padding-left: 15px; }
    .section h3 { color: #4a3f5c; margin-top: 0; }
    .field { margin-bottom: 12px; }
    .field-label { font-weight: bold; color: #4a3f5c; }
    .field-value { color: #666; margin-top: 4px; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Meta Ads Onboarding Form Submission</h1>
      <p>Submission ID: <strong>${submission.id}</strong></p>
      <p>Submitted on: <strong>${new Date().toLocaleString()}</strong></p>
    </div>

    <div class="section">
      <h3>Section 1: Business Information</h3>
      <div class="field">
        <div class="field-label">Business Name:</div>
        <div class="field-value">${input.businessName || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Business Type:</div>
        <div class="field-value">${input.businessType || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Duration in Market:</div>
        <div class="field-value">${input.businessDuration || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Location:</div>
        <div class="field-value">${input.businessLocation || "N/A"}</div>
      </div>
    </div>

    <div class="section">
      <h3>Section 2: Campaign Objective</h3>
      <div class="field">
        <div class="field-label">Primary Goal:</div>
        <div class="field-value">${input.campaignGoal || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Desired Action:</div>
        <div class="field-value">${input.desiredAction || "N/A"}</div>
      </div>
    </div>

    <div class="section">
      <h3>Section 3: Budget and Duration</h3>
      <div class="field">
        <div class="field-label">Daily Budget (INR):</div>
        <div class="field-value">${input.dailyBudget || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Campaign Duration (days):</div>
        <div class="field-value">${input.campaignDuration || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Start Date:</div>
        <div class="field-value">${input.startDate || "N/A"}</div>
      </div>
    </div>

    <div class="section">
      <h3>Section 4: Target Audience</h3>
      <div class="field">
        <div class="field-label">Target Location:</div>
        <div class="field-value">${input.targetLocation || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Age Group:</div>
        <div class="field-value">${input.targetAgeGroup || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Gender:</div>
        <div class="field-value">${input.targetGender || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Ideal Customer:</div>
        <div class="field-value">${input.idealCustomer || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Interests/Behaviors:</div>
        <div class="field-value">${input.audienceInterests || "N/A"}</div>
      </div>
    </div>

    <div class="section">
      <h3>Section 5: Product/Service Details</h3>
      <div class="field">
        <div class="field-label">Offering:</div>
        <div class="field-value">${input.offering || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Price Range:</div>
        <div class="field-value">${input.priceRange || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Offers/Discounts:</div>
        <div class="field-value">${input.offersDiscounts || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">USP:</div>
        <div class="field-value">${input.usp || "N/A"}</div>
      </div>
    </div>

    <div class="section">
      <h3>Section 6: Lead Handling</h3>
      <div class="field">
        <div class="field-label">Lead Direction:</div>
        <div class="field-value">${input.leadDirection || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Contact Number:</div>
        <div class="field-value">${input.contactNumber || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Lead Manager:</div>
        <div class="field-value">${input.leadManager || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Expected Response Time:</div>
        <div class="field-value">${input.responseTime || "N/A"}</div>
      </div>
    </div>

    <div class="section">
      <h3>Section 7: Previous Advertising Data</h3>
      <div class="field">
        <div class="field-label">Previous Ads:</div>
        <div class="field-value">${input.previousAds || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Past Results:</div>
        <div class="field-value">${input.pastResults || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Customer Database:</div>
        <div class="field-value">${input.customerDatabase || "N/A"}</div>
      </div>
    </div>

    <div class="section">
      <h3>Section 8: Online Presence</h3>
      <div class="field">
        <div class="field-label">Facebook Page:</div>
        <div class="field-value">${input.facebookPage || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Instagram Page:</div>
        <div class="field-value">${input.instagramPage || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Website:</div>
        <div class="field-value">${input.website || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Google Business Profile:</div>
        <div class="field-value">${input.googleBusinessProfile || "N/A"}</div>
      </div>
    </div>

    <div class="section">
      <h3>Section 9: Creatives</h3>
      <div class="field">
        <div class="field-label">Available Creatives:</div>
        <div class="field-value">${input.availableCreatives || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Need New Creatives:</div>
        <div class="field-value">${input.needNewCreatives || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Creative Message/Angle:</div>
        <div class="field-value">${input.creativeMessage || "N/A"}</div>
      </div>
    </div>

    <div class="section">
      <h3>Section 10: Access and Permissions</h3>
      <div class="field">
        <div class="field-label">Ad Account Type:</div>
        <div class="field-value">${input.adAccountType || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Has Meta Business Manager:</div>
        <div class="field-value">${input.hasMetaBusinessManager || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Ad Account Access:</div>
        <div class="field-value">${input.adAccountAccess || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Facebook Page Access:</div>
        <div class="field-value">${input.facebookPageAccess || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Instagram Account Access:</div>
        <div class="field-value">${input.instagramAccountAccess || "N/A"}</div>
      </div>
    </div>

    <div class="section">
      <h3>Section 11: Reporting and Expectations</h3>
      <div class="field">
        <div class="field-label">Reporting Frequency:</div>
        <div class="field-value">${input.reportingFrequency || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Success Metrics:</div>
        <div class="field-value">${input.successMetrics || "N/A"}</div>
      </div>
    </div>

    <div class="section">
      <h3>Section 12: Additional Notes</h3>
      <div class="field-value">${input.additionalNotes || "No additional notes"}</div>
    </div>

    <div class="footer">
      <p>This is an automated email from Meta Ads Onboarding Form. Please do not reply to this email.</p>
      <p>&copy; 2026 Meta Ads Onboarding. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
        `;

        // Send email to user
        try {
          await sendEmail({
            to: "workmj.work@gmail.com",
            subject: "Meta Ads Onboarding Form Submission",
            htmlContent: emailContent,
          });
        } catch (error) {
          console.error("Error sending email:", error);
        }

        // Send notification to owner
        await notifyOwner({
          title: "New Meta Ads Onboarding Form Submission",
          content: `New form submission received from ${input.businessName || "Unknown Business"}. Contact: ${input.contactNumber}. Check email for full details.`,
        });

        return {
          success: true,
          submissionId: submission.id,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
