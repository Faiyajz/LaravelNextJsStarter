import React from "react";
import { Route } from "react-router-dom";
import {
  BuyerProtectedRoute,
  BuyerHomePage,
  BuyerProfilePage,
  BuyerOrdersPage,
} from "@/modules/buyer";

export const buyerRoutes = [
  <Route
    key="buyer-home"
    path="/buyer"
    element={
      <BuyerProtectedRoute>
        <BuyerHomePage />
      </BuyerProtectedRoute>
    }
  />,
  <Route
    key="buyer-profile"
    path="/buyer/profile"
    element={
      <BuyerProtectedRoute>
        <BuyerProfilePage />
      </BuyerProtectedRoute>
    }
  />,
  <Route
    key="buyer-orders"
    path="/buyer/orders"
    element={
      <BuyerProtectedRoute>
        <BuyerOrdersPage />
      </BuyerProtectedRoute>
    }
  />,
];
