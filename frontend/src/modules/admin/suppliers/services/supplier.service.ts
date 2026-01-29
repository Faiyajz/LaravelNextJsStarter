import { api, withSkipErrorToast } from "@/modules/shared";
import type {
  Supplier,
  SupplierFormData,
  SupplierFilters,
  PaginatedResponse,
  ApiResponse,
} from "@/modules/shared";

export const supplierService = {
  /**
   * Get paginated list of suppliers
   */
  async getAll(
    filters?: SupplierFilters,
  ): Promise<PaginatedResponse<Supplier>> {
    const { data } = await api.get<PaginatedResponse<Supplier>>("/suppliers", {
      params: filters,
    });
    return data;
  },

  /**
   * Get a single supplier by ID
   */
  async getById(id: string): Promise<Supplier> {
    const { data } = await api.get<ApiResponse<Supplier>>(
      `/suppliers/${id}`,
      withSkipErrorToast(),
    );
    return data.data;
  },

  /**
   * Create a new supplier
   */
  async create(supplierData: SupplierFormData): Promise<Supplier> {
    const { data } = await api.post<ApiResponse<Supplier>>(
      "/suppliers",
      supplierData,
      withSkipErrorToast(),
    );
    return data.data;
  },

  /**
   * Update an existing supplier
   */
  async update(
    id: string,
    supplierData: Partial<SupplierFormData>,
  ): Promise<Supplier> {
    const { data } = await api.put<ApiResponse<Supplier>>(
      `/suppliers/${id}`,
      supplierData,
      withSkipErrorToast(),
    );
    return data.data;
  },

  /**
   * Delete a supplier (soft delete)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/suppliers/${id}`, withSkipErrorToast());
  },

  /**
   * Get trashed suppliers
   */
  async getTrash(filters?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Supplier>> {
    const { data } = await api.get<PaginatedResponse<Supplier>>(
      "/suppliers-trash",
      {
        params: filters,
      },
    );
    return data;
  },

  /**
   * Restore a soft-deleted supplier
   */
  async restore(id: string): Promise<Supplier> {
    const { data } = await api.post<ApiResponse<Supplier>>(
      `/suppliers/${id}/restore`,
      undefined,
      withSkipErrorToast(),
    );
    return data.data;
  },
};
