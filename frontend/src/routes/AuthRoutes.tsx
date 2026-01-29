import React from "react";
import { Route } from "react-router-dom";
import { LoginPage, RegisterPage } from "@/modules/auth";

type GuestRouteProps = {
  children: React.ReactNode;
  redirectTo: string;
};

type GuestRouteComponent = React.ComponentType<GuestRouteProps>;

export function authRoutes(GuestRoute: GuestRouteComponent) {
  return [
    <Route
      key="admin-login"
      path="/admin/login"
      element={
        <GuestRoute redirectTo="/admin">
          <LoginPage />
        </GuestRoute>
      }
    />,
    <Route
      key="admin-register"
      path="/admin/register"
      element={
        <GuestRoute redirectTo="/admin">
          <RegisterPage />
        </GuestRoute>
      }
    />,
  ];
}
