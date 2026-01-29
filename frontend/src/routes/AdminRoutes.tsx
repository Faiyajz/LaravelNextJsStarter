import React from "react";
import { Route } from "react-router-dom";
import {
  ProtectedRoute,
  HomePage,
  SuppliersListPage,
  SupplierCreatePage,
  SupplierViewPage,
  SupplierEditPage,
  BuyersListPage,
  BuyerViewPage,
  BuyerEditPage,
  FabricsListPage,
  FabricCreatePage,
  FabricViewPage,
  FabricEditPage,
  FabricStockPage,
  TrashPage,
} from "@/modules/admin";

export const adminRoutes = [
  <Route
    key="admin-home"
    path="/admin"
    element={
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-suppliers"
    path="/admin/suppliers"
    element={
      <ProtectedRoute>
        <SuppliersListPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-buyers"
    path="/admin/buyers"
    element={
      <ProtectedRoute>
        <BuyersListPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-buyers-edit"
    path="/admin/buyers/:id/edit"
    element={
      <ProtectedRoute>
        <BuyerEditPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-buyers-view"
    path="/admin/buyers/:id"
    element={
      <ProtectedRoute>
        <BuyerViewPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-suppliers-create"
    path="/admin/suppliers/create"
    element={
      <ProtectedRoute>
        <SupplierCreatePage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-suppliers-edit"
    path="/admin/suppliers/:id/edit"
    element={
      <ProtectedRoute>
        <SupplierEditPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-suppliers-view"
    path="/admin/suppliers/:id"
    element={
      <ProtectedRoute>
        <SupplierViewPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-fabrics"
    path="/admin/fabrics"
    element={
      <ProtectedRoute>
        <FabricsListPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-fabrics-create"
    path="/admin/fabrics/create"
    element={
      <ProtectedRoute>
        <FabricCreatePage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-fabrics-edit"
    path="/admin/fabrics/:id/edit"
    element={
      <ProtectedRoute>
        <FabricEditPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-fabrics-view"
    path="/admin/fabrics/:id"
    element={
      <ProtectedRoute>
        <FabricViewPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-fabrics-stock"
    path="/admin/fabrics/:id/stock"
    element={
      <ProtectedRoute>
        <FabricStockPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="admin-trash"
    path="/admin/trash"
    element={
      <ProtectedRoute>
        <TrashPage />
      </ProtectedRoute>
    }
  />,
];
