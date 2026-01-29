import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";

import {
  AuthContext,
  type AuthContextType,
} from "@/modules/auth";

type RenderOptions = {
  route?: string;
  path?: string;
  auth?: AuthContextType;
};

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  { route = "/", path, auth }: RenderOptions = {},
) {
  const queryClient = createQueryClient();
  const authValue: AuthContextType = auth ?? {
    user: null,
    token: null,
    login: vi.fn(),
    loginBuyer: vi.fn(),
    register: vi.fn(),
    registerBuyer: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
  };

  const content = path ? (
    <Routes>
      <Route path={path} element={ui} />
    </Routes>
  ) : (
    ui
  );

  return render(
    <AuthContext.Provider value={authValue}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{content}</MemoryRouter>
      </QueryClientProvider>
    </AuthContext.Provider>,
  );
}
