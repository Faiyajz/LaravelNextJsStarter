import { api, withSkipErrorToast } from "@/modules/shared";
import type {
  Fabric,
  FabricFormData,
  FabricFilters,
  PaginatedResponse,
  ApiResponse,
} from "@/modules/shared";

export const fabricService = {
  /**
   * Get paginated list of fabrics
   */
  async getAll(filters?: FabricFilters): Promise<PaginatedResponse<Fabric>> {
    const { data } = await api.get<PaginatedResponse<Fabric>>("/fabrics", {
      params: filters,
    });
    return data;
  },

  /**
   * Get a single fabric by ID
   */
  async getById(id: string): Promise<Fabric> {
    const { data } = await api.get<ApiResponse<Fabric>>(
      `/fabrics/${id}`,
      withSkipErrorToast(),
    );
    return data.data;
  },

  /**
   * Create a new fabric
   */
  async create(fabricData: FabricFormData | FormData): Promise<Fabric> {
    const { data } = await api.post<ApiResponse<Fabric>>(
      "/fabrics",
      fabricData,
      withSkipErrorToast(
        fabricData instanceof FormData
          ? {
              headers: { "Content-Type": "multipart/form-data" },
            }
          : undefined,
      ),
    );
    return data.data;
  },

  /**
   * Update an existing fabric
   */
  async update(
    id: string,
    fabricData: Partial<FabricFormData> | FormData,
  ): Promise<Fabric> {
    const { data } = await api.put<ApiResponse<Fabric>>(
      `/fabrics/${id}`,
      fabricData,
      withSkipErrorToast(
        fabricData instanceof FormData
          ? {
              headers: { "Content-Type": "multipart/form-data" },
            }
          : undefined,
      ),
    );
    return data.data;
  },

  /**
   * Delete a fabric (soft delete)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/fabrics/${id}`, withSkipErrorToast());
  },

  /**
   * Get trashed fabrics
   */
  async getTrash(filters?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Fabric>> {
    const { data } = await api.get<PaginatedResponse<Fabric>>(
      "/fabrics-trash",
      {
        params: filters,
      },
    );
    return data;
  },

  /**
   * Restore a soft-deleted fabric
   */
  async restore(id: string): Promise<Fabric> {
    const { data } = await api.post<ApiResponse<Fabric>>(
      `/fabrics/${id}/restore`,
      undefined,
      withSkipErrorToast(),
    );
    return data.data;
  },
};
