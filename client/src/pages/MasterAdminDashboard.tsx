import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Trash2, RotateCcw, Plus, ChevronDown, ChevronUp } from "lucide-react";

export default function MasterAdminDashboard() {
  const [, navigate] = useLocation();
  const [newAdminId, setNewAdminId] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedSubmission, setExpandedSubmission] = useState<number | null>(null);

  // Admin Management Queries
  const adminsQuery = trpc.masterAdmin.getAllAdmins.useQuery();
  const addAdminMutation = trpc.masterAdmin.addAdmin.useMutation();
  const resetPasswordMutation = trpc.masterAdmin.resetPassword.useMutation();
  const deleteAdminMutation = trpc.masterAdmin.deleteAdmin.useMutation();

  // Form Submission Queries
  const submissionsQuery = trpc.admin.getSubmissions.useQuery();
  const deleteSubmissionMutation = trpc.admin.deleteSubmission.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAdminId) {
      toast.error("Please enter an admin ID (email or mobile)");
      return;
    }

    try {
      const result = await addAdminMutation.mutateAsync({
        adminId: newAdminId,
        name: newAdminName,
      });
      
      toast.success(`Admin created! Password: ${result.password}`);
      setNewAdminId("");
      setNewAdminName("");
      setShowAddForm(false);
      adminsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to add admin");
    }
  };

  const handleResetPassword = async (adminId: string) => {
    if (!confirm(`Reset password for ${adminId}?`)) return;

    try {
      const result = await resetPasswordMutation.mutateAsync({ adminId });
      toast.success(`New password: ${result.newPassword}`);
      adminsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm(`Are you sure you want to delete admin ${adminId}?`)) return;

    try {
      await deleteAdminMutation.mutateAsync({ adminId });
      toast.success("Admin deleted successfully");
      adminsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete admin");
    }
  };

  const handleDeleteSubmission = async (submissionId: number) => {
    if (!confirm(`Are you sure you want to delete submission #${submissionId}? This action cannot be undone.`)) return;

    try {
      await deleteSubmissionMutation.mutateAsync({ submissionId });
      toast.success("Submission deleted successfully");
      submissionsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete submission");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/master-admin/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const formatFieldValue = (value: any) => {
    if (!value || value === "" || value === null) return "Not provided";
    return String(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Master Admin Dashboard</h1>
            <p className="text-slate-600">Manage admins and form submissions</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="admins" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="admins">Manage Admins</TabsTrigger>
            <TabsTrigger value="submissions">Form Submissions</TabsTrigger>
          </TabsList>

          {/* Admin Management Tab */}
          <TabsContent value="admins">
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Admin Users</h2>
                <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                  <Plus size={18} />
                  Add New Admin
                </Button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddAdmin} className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Admin ID (Email or Mobile)
                      </label>
                      <Input
                        type="text"
                        placeholder="user@example.com or 9876543210"
                        value={newAdminId}
                        onChange={(e) => setNewAdminId(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Admin Name (Optional)
                      </label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={addAdminMutation.isPending}>
                        {addAdminMutation.isPending ? "Creating..." : "Create Admin"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {adminsQuery.isLoading ? (
                <div className="text-center py-8 text-slate-600">Loading admins...</div>
              ) : adminsQuery.data && adminsQuery.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Admin ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Created</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminsQuery.data.map((admin: any) => (
                        <tr key={admin.id} className="border-b border-slate-100 hover:bg-blue-50 transition">
                          <td className="py-3 px-4 text-slate-900 font-medium">{admin.adminId}</td>
                          <td className="py-3 px-4 text-slate-700">{admin.name || "-"}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              admin.isActive === "true" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {admin.isActive === "true" ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-sm">
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResetPassword(admin.adminId)}
                                disabled={resetPasswordMutation.isPending}
                                className="gap-1"
                              >
                                <RotateCcw size={16} />
                                Reset
                              </Button>
                              {admin.isMasterAdmin !== "true" && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteAdmin(admin.adminId)}
                                  disabled={deleteAdminMutation.isPending}
                                  className="gap-1"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-600">No admins found</div>
              )}
            </Card>
          </TabsContent>

          {/* Form Submissions Tab */}
          <TabsContent value="submissions">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Form Submissions</h2>

              {submissionsQuery.isLoading ? (
                <div className="text-center py-8 text-slate-600">Loading submissions...</div>
              ) : submissionsQuery.data && submissionsQuery.data.length > 0 ? (
                <div className="space-y-4">
                  {submissionsQuery.data.map((submission: any) => (
                    <div key={submission.id} className="border border-slate-200 rounded-lg overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 cursor-pointer hover:bg-blue-100 transition flex justify-between items-center"
                        onClick={() => setExpandedSubmission(expandedSubmission === submission.id ? null : submission.id)}
                      >
                        <div>
                          <div className="font-semibold text-slate-900">
                            #{submission.id} - {submission.businessName || "Unknown Business"}
                          </div>
                          <div className="text-sm text-slate-600">
                            Submitted: {new Date(submission.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubmission(submission.id);
                            }}
                            disabled={deleteSubmissionMutation.isPending}
                            className="gap-1"
                          >
                            <Trash2 size={16} />
                            Delete
                          </Button>
                          {expandedSubmission === submission.id ? (
                            <ChevronUp size={20} className="text-slate-600" />
                          ) : (
                            <ChevronDown size={20} className="text-slate-600" />
                          )}
                        </div>
                      </div>

                      {expandedSubmission === submission.id && (
                        <div className="p-6 bg-white border-t border-slate-200 space-y-6">
                          {/* Section 1: Business Information */}
                          <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-lg">Section 1: Business Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-semibold text-slate-700">Business Name:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.businessName)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Business Type:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.businessType)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Duration in Market:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.businessDuration)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Location:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.businessLocation)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Section 2: Campaign Objective */}
                          <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-lg">Section 2: Campaign Objective</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-semibold text-slate-700">Primary Goal:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.campaignGoal)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Desired Action:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.desiredAction)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Section 3: Budget and Duration */}
                          <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-lg">Section 3: Budget and Duration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-semibold text-slate-700">Daily Budget (INR):</div>
                                <div className="text-slate-600">{formatFieldValue(submission.dailyBudget)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Total Days Ad Will Run:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.campaignDuration)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Expected Ad Start Date:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.startDate)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Section 4: Target Audience */}
                          <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-lg">Section 4: Target Audience</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-semibold text-slate-700">Target Location:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.targetLocation)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Target Gender:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.targetGender)}</div>
                              </div>
                              <div className="md:col-span-2">
                                <div className="font-semibold text-slate-700">Ideal Customer:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.idealCustomer)}</div>
                              </div>
                              <div className="md:col-span-2">
                                <div className="font-semibold text-slate-700">Audience Interests:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.audienceInterests)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Section 5: Product/Service Details */}
                          <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-lg">Section 5: Product/Service Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <div className="font-semibold text-slate-700">What is the goal from this ad:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.offering)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Price Range:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.priceRange)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">USP:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.usp)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Section 6: Lead Handling */}
                          <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-lg">Section 6: Lead Handling</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-semibold text-slate-700">Lead Direction:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.leadDirection)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Contact Number:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.contactNumber)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Lead Manager:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.leadManager)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Response Time:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.responseTime)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Section 7: Previous Advertising Data */}
                          <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-lg">Section 7: Previous Advertising Data</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-semibold text-slate-700">Previous Ads:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.previousAds)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Past Results:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.pastResults)}</div>
                              </div>
                              <div className="md:col-span-2">
                                <div className="font-semibold text-slate-700">Customer Database:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.customerDatabase)}</div>
                              </div>
                              {submission.customerDataFileUrl && (
                                <div className="md:col-span-2">
                                  <div className="font-semibold text-slate-700">Customer Data File:</div>
                                  <a href={submission.customerDataFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    View File
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Section 8: Online Presence */}
                          <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-lg">Section 8: Online Presence</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-semibold text-slate-700">Facebook Page:</div>
                                <div className="text-slate-600 break-all">{formatFieldValue(submission.facebookPage)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Instagram Page:</div>
                                <div className="text-slate-600 break-all">{formatFieldValue(submission.instagramPage)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Website:</div>
                                <div className="text-slate-600 break-all">{formatFieldValue(submission.website)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Google Business Profile:</div>
                                <div className="text-slate-600 break-all">{formatFieldValue(submission.googleBusinessProfile)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Section 9: Creatives */}
                          <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-lg">Section 9: Creatives</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-semibold text-slate-700">Available Creatives:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.availableCreatives)}</div>
                              </div>
                              <div className="md:col-span-2">
                                <div className="font-semibold text-slate-700">Creative Message:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.creativeMessage)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Section 10: Access and Permissions */}
                          <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-lg">Section 10: Access and Permissions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-semibold text-slate-700">Ad Account Type:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.adAccountType)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Meta Business Manager:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.hasMetaBusinessManager)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Facebook ID:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.facebookId)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Facebook Password:</div>
                                <div className="text-slate-600">{submission.facebookPassword ? "***" : "Not provided"}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Instagram Username:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.instagramUsername)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Instagram Password:</div>
                                <div className="text-slate-600">{submission.instagramPassword ? "***" : "Not provided"}</div>
                              </div>
                            </div>
                          </div>

                          {/* Section 11: Reporting and Expectations */}
                          <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-lg">Section 11: Reporting and Expectations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="font-semibold text-slate-700">Reporting Frequency:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.reportingFrequency)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700">Success Metrics:</div>
                                <div className="text-slate-600">{formatFieldValue(submission.successMetrics)}</div>
                              </div>
                            </div>
                          </div>

                          {/* Section 12: Additional Notes */}
                          <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-lg">Section 12: Additional Notes</h3>
                            <div className="text-slate-600">{formatFieldValue(submission.additionalNotes)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-600">No submissions found</div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
