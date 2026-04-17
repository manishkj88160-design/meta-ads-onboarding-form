import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Trash2, RotateCcw, Plus } from "lucide-react";

export default function MasterAdminDashboard() {
  const [, navigate] = useLocation();
  const [newAdminId, setNewAdminId] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const adminsQuery = trpc.masterAdmin.getAllAdmins.useQuery();
  const addAdminMutation = trpc.masterAdmin.addAdmin.useMutation();
  const resetPasswordMutation = trpc.masterAdmin.resetPassword.useMutation();
  const deleteAdminMutation = trpc.masterAdmin.deleteAdmin.useMutation();

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
    if (!confirm(`Are you sure you want to delete ${adminId}? This cannot be undone.`)) return;

    try {
      await deleteAdminMutation.mutateAsync({ adminId });
      toast.success("Admin deleted successfully");
      adminsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete admin");
    }
  };

  const handleLogout = () => {
    document.cookie = "master_admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/master-admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-800">
              Master Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-2">Manage all admin users and access control</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>

        {/* Add Admin Form */}
        {showAddForm && (
          <Card className="mb-8 p-6 bg-blue-50 border-blue-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Add New Admin</h2>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Admin ID (Email or Mobile)
                  </label>
                  <Input
                    type="text"
                    placeholder="admin@example.com or 9876543210"
                    value={newAdminId}
                    onChange={(e) => setNewAdminId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Admin Name"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={addAdminMutation.isPending}
                >
                  {addAdminMutation.isPending ? "Creating..." : "Create Admin"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="mb-6 bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Admin
          </Button>
        )}

        {/* Admin Users List */}
        <Card className="shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Admin Users ({adminsQuery.data?.length || 0})
            </h2>

            {adminsQuery.isLoading ? (
              <p className="text-slate-600">Loading admin users...</p>
            ) : adminsQuery.data?.length === 0 ? (
              <p className="text-slate-600">No admin users yet</p>
            ) : (
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
                    {adminsQuery.data?.map((admin) => (
                      <tr key={admin.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-800 font-mono text-sm">{admin.adminId}</td>
                        <td className="py-3 px-4 text-slate-700">{admin.name || "-"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              admin.isActive === "true"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
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
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleResetPassword(admin.adminId)}
                              disabled={resetPasswordMutation.isPending}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteAdmin(admin.adminId)}
                              disabled={deleteAdminMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 p-4 bg-amber-50 border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Admin ID Format:</strong> Must be a valid email (admin@example.com) or 10-digit mobile number (9876543210)
          </p>
        </Card>
      </div>
    </div>
  );
}
