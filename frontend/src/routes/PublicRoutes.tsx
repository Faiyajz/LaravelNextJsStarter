import React from "react";
import { Route } from "react-router-dom";
import {
  PublicHomePage,
  AboutPage,
  ContactPage,
  PolicyPage,
  PublicLoginPage,
  PublicRegisterPage,
} from "@/modules/public";

export const publicRoutes = [
  <Route key="public-home" path="/" element={<PublicHomePage />} />,
  <Route key="public-about" path="/about" element={<AboutPage />} />,
  <Route key="public-contact" path="/contact" element={<ContactPage />} />,
  <Route key="public-policy" path="/policy" element={<PolicyPage />} />,
  <Route key="public-login" path="/login" element={<PublicLoginPage />} />,
  <Route key="public-register" path="/register" element={<PublicRegisterPage />} />,
];
