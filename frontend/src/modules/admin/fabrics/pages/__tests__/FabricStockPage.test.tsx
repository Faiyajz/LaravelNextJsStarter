import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import FabricStockPage from "@/modules/admin/fabrics/pages/FabricStockPage";
import { renderWithProviders } from "@/test/test-utils";

const fabricMocks = vi.hoisted(() => ({
  getById: vi.fn(),
  createStock: vi.fn(),
}));
const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));

vi.mock("@/modules/admin/fabrics/services/fabric.service", () => ({
  fabricService: {
    getById: fabricMocks.getById,
  },
}));

vi.mock("@/modules/admin/fabrics/services/fabricStock.service", () => ({
  fabricStockService: {
    create: fabricMocks.createStock,
  },
}));

vi.mock("@/modules/shared", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/modules/shared")>();

  return {
    ...actual,
    notify: toastMocks,
  };
});

describe("FabricStockPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits a stock transaction", async () => {
    const user = userEvent.setup();
    fabricMocks.getById.mockResolvedValue({
      id: "fab-1",
      fabric_no: "FAB-001",
      supplier: { company_name: "Acme Textiles" },
      available_balance: 50,
      stocks: [],
    });

    fabricMocks.createStock.mockResolvedValueOnce({
      stock: { id: "st-1" },
      available_balance: 60,
    });

    renderWithProviders(<FabricStockPage />, {
      route: "/admin/fabrics/fab-1/stock",
      path: "/admin/fabrics/:id/stock",
    });

    expect(
      await screen.findByText(/stock management/i),
    ).toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText(/transaction type/i),
      "IN",
    );
    await user.type(screen.getByLabelText(/quantity/i), "10");
    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    await waitFor(() =>
      expect(fabricMocks.createStock).toHaveBeenCalledWith({
        fabric_id: "fab-1",
        type: "IN",
        quantity: 10,
        reference: null,
      }),
    );
  });

  it("shows an error toast when stock creation fails", async () => {
    const user = userEvent.setup();
    fabricMocks.getById.mockResolvedValue({
      id: "fab-1",
      fabric_no: "FAB-001",
      supplier: { company_name: "Acme Textiles" },
      available_balance: 5,
      stocks: [],
    });
    fabricMocks.createStock.mockRejectedValueOnce({
      response: { data: { message: "Insufficient balance." } },
    });

    renderWithProviders(<FabricStockPage />, {
      route: "/admin/fabrics/fab-1/stock",
      path: "/admin/fabrics/:id/stock",
    });

    await screen.findByText(/stock management/i);
    await user.selectOptions(
      screen.getByLabelText(/transaction type/i),
      "OUT",
    );
    await user.type(screen.getByLabelText(/quantity/i), "10");
    await user.click(screen.getByRole("button", { name: /add transaction/i }));

    await waitFor(() =>
      expect(toastMocks.error).toHaveBeenCalledWith(
        "Insufficient balance.",
      ),
    );
  });

  it("shows not found state when fetch fails", async () => {
    fabricMocks.getById.mockRejectedValueOnce(new Error("Not found"));

    renderWithProviders(<FabricStockPage />, {
      route: "/admin/fabrics/fab-1/stock",
      path: "/admin/fabrics/:id/stock",
    });

    expect(await screen.findByText(/fabric not found/i)).toBeInTheDocument();
  });
});
