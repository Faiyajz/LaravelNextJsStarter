import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/modules/admin";
import { AuthContext, type AuthContextType } from "@/modules/auth";

function renderWithAuth(auth: AuthContextType) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>Secret</div>
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("ProtectedRoute", () => {
  it("redirects unauthenticated users to login", async () => {
    const auth: AuthContextType = {
      user: null,
      token: null,
      login: async () => {},
      loginBuyer: async () => {},
      register: async () => {},
      registerBuyer: async () => {},
      logout: async () => {},
      isLoading: false,
    };

    const { container } = renderWithAuth(auth);

    expect(await screen.findByText("Login")).toBeInTheDocument();
    expect(container).not.toHaveTextContent("Secret");
  });

  it("renders children for authenticated users", async () => {
    const auth: AuthContextType = {
      user: { id: "u1", name: "Test", email: "t@t.com", created_at: "", updated_at: "" },
      token: "token",
      login: async () => {},
      loginBuyer: async () => {},
      register: async () => {},
      registerBuyer: async () => {},
      logout: async () => {},
      isLoading: false,
    };

    const { container } = renderWithAuth(auth);

    expect(await screen.findByText("Secret")).toBeInTheDocument();
    expect(container).not.toHaveTextContent("Login");
  });

  it("shows a loading state while auth is initializing", async () => {
    const auth: AuthContextType = {
      user: null,
      token: null,
      login: async () => {},
      loginBuyer: async () => {},
      register: async () => {},
      registerBuyer: async () => {},
      logout: async () => {},
      isLoading: true,
    };

    renderWithAuth(auth);

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });
});
