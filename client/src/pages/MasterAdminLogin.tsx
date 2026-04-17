import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function MasterAdminLogin() {
  const [masterId, setMasterId] = useState("");
  const [password, setPassword] = useState("");
  const [, navigate] = useLocation();
  const loginMutation = trpc.masterAdmin.login.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!masterId || !password) {
      toast.error("Please enter both Master ID and password");
      return;
    }

    try {
      await loginMutation.mutateAsync({
        masterId,
        password,
      });
      
      toast.success("Master Admin login successful!");
      navigate("/master-admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-slate-800 mb-2">
              Master Admin
            </h1>
            <p className="text-slate-600">Manage all admin users and access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Master ID (Email or Mobile)
              </label>
              <Input
                type="text"
                placeholder="admin@example.com or 9876543210"
                value={masterId}
                onChange={(e) => setMasterId(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login as Master Admin"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Only Master Admin can manage admin users and access control.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
