import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/modules/auth";
import BuyerLayout from "@/modules/buyer/components/BuyerLayout";

interface BuyerProtectedRouteProps {
  children: ReactNode;
}

export default function BuyerProtectedRoute({
  children,
}: BuyerProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/buyer/login" replace />;
  }

  const isBuyer = user.roles?.some((role) => role.name === "buyer");
  if (!isBuyer) {
    return <Navigate to="/admin" replace />;
  }

  return <BuyerLayout>{children}</BuyerLayout>;
}
