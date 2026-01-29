import { api } from "@/modules/shared";
import type { ApiResponse, Buyer, BuyerUpdateData, PaginatedResponse } from "@/modules/shared";

export interface BuyerFilters {
  page?: number;
  per_page?: number;
  search?: string;
  country?: string;
  company_name?: string;
}

export const buyerService = {
  async getAll(filters: BuyerFilters): Promise<PaginatedResponse<Buyer>> {
    const { data } = await api.get<PaginatedResponse<Buyer>>("/buyers", {
      params: filters,
    });
    return data;
  },

  async getById(id: string): Promise<Buyer> {
    const { data } = await api.get<ApiResponse<Buyer>>(`/buyers/${id}`);
    return data.data;
  },

  async update(id: string, payload: BuyerUpdateData): Promise<Buyer> {
    const { data } = await api.put<ApiResponse<Buyer>>(`/buyers/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/buyers/${id}`);
  },
};
