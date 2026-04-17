import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createFormSubmission, getAdminUserByAdminId, getAllAdminUsers, createAdminUser, updateAdminPassword, deleteAdminUser, getAllFormSubmissions, getFormSubmissionById } from "./db";
import { notifyOwner } from "./_core/notification";
import { sendEmail } from "./_core/emailService";
import { hashPassword, verifyPassword, generateRandomPassword } from "./_core/adminAuth";

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
  targetGender: z.string().optional(),
  idealCustomer: z.string().optional(),
  audienceInterests: z.string().optional(),
  offering: z.string().optional(),
  priceRange: z.string().optional(),
  usp: z.string().optional(),
  leadDirection: z.string().optional(),
  contactNumber: z.string().min(1, "Contact number is required"),
  leadManager: z.string().optional(),
  responseTime: z.string().optional(),
  previousAds: z.string().optional(),
  pastResults: z.string().optional(),
  customerDatabase: z.string().optional(),
  customerDataFileUrl: z.string().optional(),
  facebookPage: z.string().min(1, "Facebook page link is required"),
  instagramPage: z.string().min(1, "Instagram page link is required"),
  website: z.string().optional(),
  googleBusinessProfile: z.string().optional(),
  availableCreatives: z.string().optional(),
  creativeMessage: z.string().optional(),
  adAccountType: z.string().optional(),
  hasMetaBusinessManager: z.string().optional(),
  facebookId: z.string().optional(),
  facebookPassword: z.string().optional(),
  instagramUsername: z.string().optional(),
  instagramPassword: z.string().optional(),
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

  admin: router({
    login: publicProcedure
      .input(z.object({
        adminId: z.string().min(1, "Admin ID is required"),
        password: z.string().min(1, "Password is required"),
      }))
      .mutation(async ({ input, ctx }) => {
        const admin = await getAdminUserByAdminId(input.adminId);
        
        if (!admin || admin.isActive !== "true") {
          throw new Error("Invalid admin ID or password");
        }
        
        if (!verifyPassword(input.password, admin.passwordHash)) {
          throw new Error("Invalid admin ID or password");
        }
        
        // Set admin session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie("admin_session", JSON.stringify({ adminId: admin.adminId, id: admin.id }), {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
        return {
          success: true,
          adminId: admin.adminId,
          name: admin.name,
        };
      }),
    
    getSubmissions: publicProcedure.query(async () => {
      return await getAllFormSubmissions();
    }),
    
    getSubmissionById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getFormSubmissionById(input.id);
      }),
    
    getAdminUsers: publicProcedure.query(async () => {
      return await getAllAdminUsers();
    }),
    
    addAdminUser: publicProcedure
      .input(z.object({
        adminId: z.string().min(1, "Admin ID is required"),
        name: z.string().optional(),
        password: z.string().min(1, "Password is required"),
      }))
      .mutation(async ({ input }) => {
        const passwordHash = hashPassword(input.password);
        return await createAdminUser({
          adminId: input.adminId,
          passwordHash,
          name: input.name,
          isActive: "true",
        });
      }),
    
    resetAdminPassword: publicProcedure
      .input(z.object({
        adminId: z.string().min(1, "Admin ID is required"),
        newPassword: z.string().min(1, "New password is required"),
      }))
      .mutation(async ({ input }) => {
        const passwordHash = hashPassword(input.newPassword);
        await updateAdminPassword(input.adminId, passwordHash);
        return { success: true };
      }),
    
    removeAdminUser: publicProcedure
      .input(z.object({ adminId: z.string().min(1, "Admin ID is required") }))
      .mutation(async ({ input }) => {
        await deleteAdminUser(input.adminId);
        return { success: true };
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
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .section { margin-bottom: 25px; border-left: 4px solid #667eea; padding-left: 15px; }
    .section h3 { color: #667eea; margin-top: 0; }
    .field { margin-bottom: 12px; }
    .field-label { font-weight: bold; color: #667eea; }
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
        <div class="field-label">Total number of days ad is going to run:</div>
        <div class="field-value">${input.campaignDuration || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Expected Ad Start Dates:</div>
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
        <div class="field-label">What is the goal from this ad:</div>
        <div class="field-value">${input.offering || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Product/Services Price Range:</div>
        <div class="field-value">${input.priceRange || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">USP:</div>
        <div class="field-value">${input.usp || "N/A"}</div>
      </div>
    </div>

    <div class="section">
      <h3>Section 6: Lead Handling and Conversion Path</h3>
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
        <div class="field-label">Response Time:</div>
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
      <div class="field">
        <div class="field-label">Customer Data File:</div>
        <div class="field-value">${input.customerDataFileUrl ? `<a href="${input.customerDataFileUrl}">View File</a>` : "N/A"}</div>
      </div>
    </div>

    <div class="section">
      <h3>Section 8: Online Presence</h3>
      <div class="field">
        <div class="field-label">Facebook Page:</div>
        <div class="field-value">${input.facebookPage ? `<a href="${input.facebookPage}">Link</a>` : "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Instagram Page:</div>
        <div class="field-value">${input.instagramPage ? `<a href="${input.instagramPage}">Link</a>` : "N/A"}</div>
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
        <div class="field-label">Creative Message:</div>
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
        <div class="field-label">Facebook ID:</div>
        <div class="field-value">${input.facebookId || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Facebook Password:</div>
        <div class="field-value">${input.facebookPassword ? "***" : "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Instagram Username:</div>
        <div class="field-value">${input.instagramUsername || "N/A"}</div>
      </div>
      <div class="field">
        <div class="field-label">Instagram Password:</div>
        <div class="field-value">${input.instagramPassword ? "***" : "N/A"}</div>
      </div>
      <div class="field" style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 4px;">
        <div style="font-style: italic; color: #666;">
          <strong>Note:</strong> If you don't want to add your credentials then you can also connect with <strong>Shunya&co</strong> team
        </div>
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
