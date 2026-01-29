import React from "react";
import { BrowserRouter, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import {
  adminRoutes,
  authRoutes,
  buyerAuthRoutes,
  buyerRoutes,
  publicRoutes,
} from "@/routes";
import { useAuth } from "@/modules/auth";

const queryClient = new QueryClient();

function GuestRoute({
  children,
  redirectTo,
}: {
  children: React.ReactNode;
  redirectTo: string;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (user) return <Navigate to={redirectTo} replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {publicRoutes}
          {authRoutes(GuestRoute)}
          {adminRoutes}
          {buyerAuthRoutes(GuestRoute)}
          {buyerRoutes}
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
