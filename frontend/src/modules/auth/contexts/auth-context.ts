import { createContext, useContext } from "react";
import type { User } from "@/modules/shared";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginBuyer: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ) => Promise<void>;
  registerBuyer: (
    name: string,
    email: string,
    company_name: string,
    country: string,
    phone: string | null,
    password: string,
    password_confirmation: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
