import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import FabricsListPage from "@/modules/admin/fabrics/pages/FabricsListPage";
import { renderWithProviders } from "@/test/test-utils";

const fabricMocks = vi.hoisted(() => ({
  getAll: vi.fn(),
}));

vi.mock("@/modules/admin/fabrics/services/fabric.service", () => ({
  fabricService: {
    getAll: fabricMocks.getAll,
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

describe("FabricsListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("paginates to the next page", async () => {
    const user = userEvent.setup();
    fabricMocks.getAll.mockResolvedValue({
      data: [
        {
          id: "fab-1",
          fabric_no: "FAB-001",
          composition: "Cotton",
          production_type: "Bulk",
          supplier: { company_name: "Acme Textiles" },
          created_at: new Date().toISOString(),
        },
      ],
      meta: { current_page: 1, last_page: 2, per_page: 10, total: 11 },
    });

    renderWithProviders(<FabricsListPage />);

    await screen.findByText(/showing/i);
    await user.click(await screen.findByRole("link", { name: /next/i }));

    await waitFor(() =>
      expect(fabricMocks.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 }),
      ),
    );
  });

  it("applies search after debounce", async () => {
    fabricMocks.getAll.mockResolvedValue({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
    });

    renderWithProviders(<FabricsListPage />);

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "Cotton" },
    });

    await waitFor(() =>
      expect(fabricMocks.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ search: "Cotton" }),
      ),
    );

  });
});
