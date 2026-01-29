import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import SupplierCreatePage from "@/modules/admin/suppliers/pages/SupplierCreatePage";
import { renderWithProviders } from "@/test/test-utils";

const navigateMock = vi.fn();
const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));
const supplierMocks = vi.hoisted(() => ({
  create: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/modules/admin/suppliers/services/supplier.service", () => ({
  supplierService: {
    create: supplierMocks.create,
  },
}));

vi.mock("@/modules/shared", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/modules/shared")>();

  return {
    ...actual,
    notify: toastMocks,
  };
});

describe("SupplierCreatePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits the create form", async () => {
    const user = userEvent.setup();
    supplierMocks.create.mockResolvedValueOnce({ id: "sup-1" });

    renderWithProviders(<SupplierCreatePage />);

    await user.type(screen.getByLabelText(/country/i), "USA");
    await user.type(screen.getByLabelText(/company name/i), "Acme Textiles");
    await user.type(screen.getByLabelText(/^code/i), "ACME-01");

    await user.click(
      screen.getByRole("button", { name: /create supplier/i }),
    );

    await waitFor(() =>
      expect(supplierMocks.create).toHaveBeenCalledWith(
        expect.objectContaining({
          country: "USA",
          company_name: "Acme Textiles",
          code: "ACME-01",
        }),
      ),
    );
    expect(navigateMock).toHaveBeenCalledWith("/admin/suppliers");
  });

  it("shows an error toast when create fails", async () => {
    const user = userEvent.setup();
    supplierMocks.create.mockRejectedValueOnce(new Error("boom"));

    renderWithProviders(<SupplierCreatePage />);

    await user.type(screen.getByLabelText(/country/i), "USA");
    await user.type(screen.getByLabelText(/company name/i), "Acme Textiles");
    await user.type(screen.getByLabelText(/^code/i), "ACME-01");

    await user.click(
      screen.getByRole("button", { name: /create supplier/i }),
    );

    await waitFor(() =>
      expect(toastMocks.error).toHaveBeenCalledWith(
        "Failed to create supplier",
      ),
    );
    expect(navigateMock).not.toHaveBeenCalledWith("/admin/suppliers");
  });
});
