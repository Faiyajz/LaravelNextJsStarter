import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { LoginPage } from "@/modules/auth";
import { renderWithProviders } from "@/test/test-utils";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  it("submits credentials and navigates on success", async () => {
    const user = userEvent.setup();
    const loginMock = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(<LoginPage />, {
      route: "/admin/login",
      path: "/admin/login",
      auth: {
        user: null,
        token: null,
        login: loginMock,
        loginBuyer: vi.fn(),
        register: vi.fn(),
        registerBuyer: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      },
    });

    await user.type(screen.getByLabelText(/email address/i), "user@test.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(loginMock).toHaveBeenCalledWith("user@test.com", "password123");
    expect(navigateMock).toHaveBeenCalledWith("/admin");
  });

  it("does not navigate when login fails", async () => {
    const user = userEvent.setup();
    const loginMock = vi.fn().mockRejectedValue(new Error("Invalid"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithProviders(<LoginPage />, {
      route: "/admin/login",
      path: "/admin/login",
      auth: {
        user: null,
        token: null,
        login: loginMock,
        loginBuyer: vi.fn(),
        register: vi.fn(),
        registerBuyer: vi.fn(),
        logout: vi.fn(),
        isLoading: false,
      },
    });

    await user.type(screen.getByLabelText(/email address/i), "user@test.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(loginMock).toHaveBeenCalledWith("user@test.com", "wrongpass");
    expect(navigateMock).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
