import React from "react";
import { Route } from "react-router-dom";
import { BuyerLoginPage, BuyerRegisterPage } from "@/modules/buyer";

type GuestRouteProps = {
  children: React.ReactNode;
  redirectTo: string;
};

type GuestRouteComponent = React.ComponentType<GuestRouteProps>;

export function buyerAuthRoutes(GuestRoute: GuestRouteComponent) {
  return [
    <Route
      key="buyer-login"
      path="/buyer/login"
      element={
        <GuestRoute redirectTo="/buyer">
          <BuyerLoginPage />
        </GuestRoute>
      }
    />,
    <Route
      key="buyer-register"
      path="/buyer/register"
      element={
        <GuestRoute redirectTo="/buyer">
          <BuyerRegisterPage />
        </GuestRoute>
      }
    />,
  ];
}
