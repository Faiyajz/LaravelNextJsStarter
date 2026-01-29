import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import SuppliersListPage from "@/modules/admin/suppliers/pages/SuppliersListPage";
import { renderWithProviders } from "@/test/test-utils";

const supplierMocks = vi.hoisted(() => ({
  getAll: vi.fn(),
}));

vi.mock("@/modules/admin/suppliers/services/supplier.service", () => ({
  supplierService: {
    getAll: supplierMocks.getAll,
    delete: vi.fn(),
  },
}));

vi.mock("@/modules/shared", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/modules/shared")>();

  return {
    ...actual,
    useDebouncedValue: (value: unknown) => value,
  };
});

describe("SuppliersListPage", () => {
  it("renders suppliers from the API", async () => {
    supplierMocks.getAll.mockResolvedValueOnce({
      data: [
        {
          id: "sup-1",
          company_name: "Acme Textiles",
          code: "ACME-01",
          country: "USA",
          representative_name: "Jane Doe",
          created_at: new Date().toISOString(),
        },
      ],
      meta: { current_page: 1, last_page: 1, per_page: 10, total: 1 },
    });

    renderWithProviders(<SuppliersListPage />);

    expect(await screen.findByText("Acme Textiles")).toBeInTheDocument();
    expect(supplierMocks.getAll).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, per_page: 10 }),
    );
  });

  it("shows empty state when no suppliers are returned", async () => {
    supplierMocks.getAll.mockResolvedValueOnce({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
    });

    renderWithProviders(<SuppliersListPage />);

    expect(await screen.findByText(/no suppliers found/i)).toBeInTheDocument();
  });

  it("paginates to the next page", async () => {
    const user = userEvent.setup();
    supplierMocks.getAll.mockResolvedValue({
      data: [
        {
          id: "sup-1",
          company_name: "Acme Textiles",
          code: "ACME-01",
          country: "USA",
          representative_name: "Jane Doe",
          created_at: new Date().toISOString(),
        },
      ],
      meta: { current_page: 1, last_page: 2, per_page: 10, total: 15 },
    });

    renderWithProviders(<SuppliersListPage />);

    await screen.findByText(/showing/i);
    await user.click(await screen.findByRole("link", { name: /next/i }));

    await waitFor(() =>
      expect(supplierMocks.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 }),
      ),
    );
  });

  it("applies search after debounce", async () => {
    supplierMocks.getAll.mockResolvedValue({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
    });

    renderWithProviders(<SuppliersListPage />);

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "Acme" },
    });

    await waitFor(() =>
      expect(supplierMocks.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ search: "Acme" }),
      ),
    );

  });
});
