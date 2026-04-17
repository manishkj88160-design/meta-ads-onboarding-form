import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";

type SubmissionDetailsType = {
  [key: number]: boolean;
};

interface FormSubmission {
  id: number;
  businessName?: string | null;
  businessType?: string | null;
  businessDuration?: string | null;
  businessLocation?: string | null;
  campaignGoal?: string | null;
  desiredAction?: string | null;
  dailyBudget?: string | null;
  campaignDuration?: string | null;
  startDate?: string | null;
  targetLocation?: string | null;
  targetGender?: string | null;
  idealCustomer?: string | null;
  audienceInterests?: string | null;
  offering?: string | null;
  priceRange?: string | null;
  usp?: string | null;
  leadDirection?: string | null;
  contactNumber?: string | null;
  leadManager?: string | null;
  responseTime?: string | null;
  previousAds?: string | null;
  pastResults?: string | null;
  customerDatabase?: string | null;
  customerDataFileUrl?: string | null;
  facebookPage?: string | null;
  instagramPage?: string | null;
  website?: string | null;
  googleBusinessProfile?: string | null;
  availableCreatives?: string | null;
  creativeMessage?: string | null;
  adAccountType?: string | null;
  hasMetaBusinessManager?: string | null;
  facebookId?: string | null;
  facebookPassword?: string | null;
  instagramUsername?: string | null;
  instagramPassword?: string | null;
  reportingFrequency?: string | null;
  successMetrics?: string | null;
  additionalNotes?: string | null;
  createdAt: Date;
  updatedAt?: Date;
}

const formSections = [
  {
    title: "1. Business Information",
    fields: [
      { key: "businessName", label: "Business Name" },
      { key: "businessType", label: "Business Type (Product/Service)" },
      { key: "businessDuration", label: "How long have you been in the market?" },
      { key: "businessLocation", label: "Business Location (City and Area)" },
    ],
  },
  {
    title: "2. Campaign Objective",
    fields: [
      { key: "campaignGoal", label: "What is your primary goal from this ad campaign?" },
      { key: "desiredAction", label: "What action do you want users to take after seeing the ad?" },
    ],
  },
  {
    title: "3. Budget and Duration",
    fields: [
      { key: "dailyBudget", label: "Daily Ad Budget (INR)" },
      { key: "campaignDuration", label: "Total number of days ad is going to run" },
      { key: "startDate", label: "Expected Ad Start Dates" },
    ],
  },
  {
    title: "4. Target Audience",
    fields: [
      { key: "targetLocation", label: "Target Location (specific area or radius in KM)" },
      { key: "targetGender", label: "Target Gender" },
      { key: "idealCustomer", label: "Describe your ideal customer" },
      { key: "audienceInterests", label: "Any specific interests, behaviors, or audience targeting preferences" },
    ],
  },
  {
    title: "5. Product or Service Details",
    fields: [
      { key: "offering", label: "What is the goal from this ad" },
      { key: "priceRange", label: "Product/Services Price Range" },
      { key: "usp", label: "What makes your business unique (USP)?" },
    ],
  },
  {
    title: "6. Lead Handling and Conversion Path",
    fields: [
      { key: "leadDirection", label: "Where should leads or messages be directed?" },
      { key: "contactNumber", label: "Contact Number or WhatsApp Number" },
      { key: "leadManager", label: "Who will manage incoming leads or messages?" },
      { key: "responseTime", label: "Expected response time" },
    ],
  },
  {
    title: "7. Previous Advertising Data",
    fields: [
      { key: "previousAds", label: "Have you run ads before?" },
      { key: "pastResults", label: "If yes, share past results (leads, sales, cost per lead, etc.)" },
      { key: "customerDatabase", label: "Do you have any customer database (phone numbers, email list)?" },
      { key: "customerDataFileUrl", label: "Attach File of Customer Data or previous ad report" },
    ],
  },
  {
    title: "8. Online Presence",
    fields: [
      { key: "facebookPage", label: "Facebook Page Link" },
      { key: "instagramPage", label: "Instagram Page Link" },
      { key: "website", label: "Website Link (if available)" },
      { key: "googleBusinessProfile", label: "Google Business Profile Link (if available)" },
    ],
  },
  {
    title: "9. Creatives",
    fields: [
      { key: "availableCreatives", label: "Available creatives (Video / Images / Both)" },
      { key: "creativeMessage", label: "Any specific message, offer, or angle you want to highlight" },
    ],
  },
  {
    title: "10. Access and Permissions",
    fields: [
      { key: "adAccountType", label: "Ad Account to be used (Team Account / Business Owner Account)" },
      { key: "hasMetaBusinessManager", label: "Do you have Meta Business Manager?" },
      { key: "facebookId", label: "Facebook ID" },
      { key: "facebookPassword", label: "Facebook Password" },
      { key: "instagramUsername", label: "Instagram Username" },
      { key: "instagramPassword", label: "Instagram Password" },
    ],
  },
  {
    title: "11. Reporting and Expectations",
    fields: [
      { key: "reportingFrequency", label: "Preferred reporting frequency" },
      { key: "successMetrics", label: "What defines success for you?" },
    ],
  },
  {
    title: "12. Additional Notes",
    fields: [
      { key: "additionalNotes", label: "Any additional instructions, expectations, or important details" },
    ],
  },
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [expandedSubmissions, setExpandedSubmissions] = useState<SubmissionDetailsType>({});

  const { data: submissions, isLoading: submissionsLoading } = trpc.admin.getSubmissions.useQuery();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      setLocation("/admin/login");
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleSubmissionDetails = (id: number) => {
    setExpandedSubmissions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatFieldValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") {
      return "Not provided";
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return String(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Form Submissions Management</p>
          </div>
          <Button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            variant="destructive"
            className="gap-2"
          >
            <LogOut size={18} />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissionsLoading ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">Loading submissions...</p>
            </Card>
          ) : submissions && submissions.length > 0 ? (
            <>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-semibold">
                  Total Submissions: {submissions.length}
                </p>
              </div>
              {(submissions as FormSubmission[]).map((submission) => (
                <Card key={submission.id} className="overflow-hidden">
                  <div
                    onClick={() => toggleSubmissionDetails(submission.id)}
                    className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {submission.businessName || "Unnamed Submission"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        ID: #{submission.id}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted: {new Date(submission.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      {expandedSubmissions[submission.id] ? (
                        <ChevronUp size={24} className="text-indigo-600" />
                      ) : (
                        <ChevronDown size={24} className="text-indigo-600" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedSubmissions[submission.id] && (
                    <div className="p-6 bg-white border-t border-gray-200 space-y-8">
                      {formSections.map((section) => (
                        <div key={section.title}>
                          <h4 className="text-lg font-bold text-indigo-700 mb-4 pb-2 border-b-2 border-indigo-200">
                            {section.title}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {section.fields.map((field) => {
                              const value = submission[field.key as keyof FormSubmission];
                              return (
                                <div key={field.key} className="border-b pb-4">
                                  <p className="text-sm font-semibold text-gray-700 mb-1">
                                    {field.label}
                                  </p>
                                  <p className="text-gray-600 text-sm break-words">
                                    {formatFieldValue(value)}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {/* Submission Metadata */}
                      <div className="pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Submission ID
                            </p>
                            <p className="text-gray-800 font-mono">#{submission.id}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Submitted At
                            </p>
                            <p className="text-gray-800">
                              {new Date(submission.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No form submissions yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
