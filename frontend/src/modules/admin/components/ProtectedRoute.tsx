import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/modules/auth";
import DashboardLayout from "@/modules/admin/components/DashboardLayout";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const isAdmin = user.roles?.some((role) => role.name === "admin");
  if (!isAdmin) {
    return <Navigate to="/buyer" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
