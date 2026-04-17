import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, LogOut, Plus, Trash2, RotateCcw } from "lucide-react";

type SubmissionDetailsType = {
  [key: number]: boolean;
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [expandedSubmissions, setExpandedSubmissions] = useState<SubmissionDetailsType>({});
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showManageAdmins, setShowManageAdmins] = useState(false);
  const [newAdminId, setNewAdminId] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [resetAdminId, setResetAdminId] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { data: submissions, isLoading: submissionsLoading } = trpc.admin.getSubmissions.useQuery();
  const { data: adminUsers } = trpc.admin.getAdminUsers.useQuery();
  
  const addAdminMutation = trpc.admin.addAdminUser.useMutation({
    onSuccess: () => {
      toast.success("Admin user added successfully!");
      setNewAdminId("");
      setNewAdminName("");
      setNewAdminPassword("");
      setShowAddAdmin(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add admin user");
    },
  });

  const resetPasswordMutation = trpc.admin.resetAdminPassword.useMutation({
    onSuccess: () => {
      toast.success("Password reset successfully!");
      setResetAdminId("");
      setNewPassword("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reset password");
    },
  });

  const removeAdminMutation = trpc.admin.removeAdminUser.useMutation({
    onSuccess: () => {
      toast.success("Admin user removed successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove admin user");
    },
  });

  const handleAddAdmin = async () => {
    if (!newAdminId.trim() || !newAdminPassword.trim()) {
      toast.error("Admin ID and password are required");
      return;
    }
    await addAdminMutation.mutateAsync({
      adminId: newAdminId,
      name: newAdminName || undefined,
      password: newAdminPassword,
    });
  };

  const handleResetPassword = async () => {
    if (!resetAdminId.trim() || !newPassword.trim()) {
      toast.error("Admin ID and new password are required");
      return;
    }
    await resetPasswordMutation.mutateAsync({
      adminId: resetAdminId,
      newPassword: newPassword,
    });
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (confirm(`Are you sure you want to remove admin user "${adminId}"?`)) {
      await removeAdminMutation.mutateAsync({ adminId });
    }
  };

  const toggleSubmissionDetails = (id: number) => {
    setExpandedSubmissions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLogout = () => {
    document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => {
              setShowManageAdmins(false);
              setShowAddAdmin(false);
            }}
            variant={!showManageAdmins && !showAddAdmin ? "default" : "outline"}
          >
            Form Submissions
          </Button>
          <Button
            onClick={() => setShowManageAdmins(!showManageAdmins)}
            variant={showManageAdmins ? "default" : "outline"}
          >
            Manage Admins
          </Button>
        </div>

        {/* Form Submissions Section */}
        {!showManageAdmins && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Form Submissions ({submissions?.length || 0})
            </h2>
            
            {submissionsLoading ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">Loading submissions...</p>
              </Card>
            ) : submissions && submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <Card key={submission.id} className="p-6">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSubmissionDetails(submission.id)}
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {submission.businessName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ID: #{submission.id} | Contact: {submission.contactNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          Submitted: {new Date(submission.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {expandedSubmissions[submission.id] ? (
                        <ChevronUp size={24} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={24} className="text-gray-400" />
                      )}
                    </div>

                    {expandedSubmissions[submission.id] && (
                      <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Business Type</p>
                            <p className="text-gray-600">{submission.businessType || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Location</p>
                            <p className="text-gray-600">{submission.businessLocation || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Campaign Goal</p>
                            <p className="text-gray-600">{submission.campaignGoal || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Daily Budget</p>
                            <p className="text-gray-600">₹{submission.dailyBudget || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Facebook Page</p>
                            <p className="text-gray-600 truncate">
                              <a href={submission.facebookPage} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                View
                              </a>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Instagram Page</p>
                            <p className="text-gray-600 truncate">
                              <a href={submission.instagramPage} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                View
                              </a>
                            </p>
                          </div>
                        </div>

                        {submission.additionalNotes && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Additional Notes</p>
                            <p className="text-gray-600">{submission.additionalNotes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No form submissions yet</p>
              </Card>
            )}
          </div>
        )}

        {/* Manage Admins Section */}
        {showManageAdmins && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Manage Admin Users</h2>

            {/* Add Admin Form */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add New Admin User</h3>
                <Button
                  onClick={() => setShowAddAdmin(!showAddAdmin)}
                  variant="outline"
                  size="sm"
                >
                  {showAddAdmin ? "Cancel" : <Plus size={18} />}
                </Button>
              </div>

              {showAddAdmin && (
                <div className="space-y-4">
                  <Input
                    placeholder="Admin ID"
                    value={newAdminId}
                    onChange={(e) => setNewAdminId(e.target.value)}
                  />
                  <Input
                    placeholder="Name (optional)"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                  />
                  <Button
                    onClick={handleAddAdmin}
                    disabled={addAdminMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {addAdminMutation.isPending ? "Adding..." : "Add Admin User"}
                  </Button>
                </div>
              )}
            </Card>

            {/* Reset Password Form */}
            <Card className="p-6 bg-amber-50 border-amber-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Reset Admin Password</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Admin ID"
                  value={resetAdminId}
                  onChange={(e) => setResetAdminId(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  onClick={handleResetPassword}
                  disabled={resetPasswordMutation.isPending}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  <RotateCcw size={18} className="mr-2" />
                  {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </Card>

            {/* Admin Users List */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Admin Users ({adminUsers?.length || 0})
              </h3>
              {adminUsers && adminUsers.length > 0 ? (
                <div className="space-y-3">
                  {adminUsers.map((admin) => (
                    <div key={admin.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{admin.name || admin.adminId}</p>
                        <p className="text-sm text-gray-600">ID: {admin.adminId}</p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(admin.createdAt).toLocaleDateString()}
                        </p>
                        <p className={`text-xs font-semibold mt-2 ${admin.isActive === "true" ? "text-green-600" : "text-red-600"}`}>
                          Status: {admin.isActive === "true" ? "Active" : "Inactive"}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleRemoveAdmin(admin.adminId)}
                        disabled={removeAdminMutation.isPending}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No admin users found</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
