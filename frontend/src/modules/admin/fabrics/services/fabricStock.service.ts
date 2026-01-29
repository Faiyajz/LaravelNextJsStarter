import { api, withSkipErrorToast } from "@/modules/shared";
import type {
  FabricStockFormData,
  FabricStock,
  ApiResponse,
} from "@/modules/shared";

export const fabricStockService = {
  /**
   * Create a new fabric stock transaction
   */
  async create(stockData: FabricStockFormData): Promise<{
    stock: FabricStock;
    available_balance: number;
  }> {
    const { data } = await api.post<ApiResponse<{
      stock: FabricStock;
      available_balance: number;
    }>>("/fabric-stocks", stockData, withSkipErrorToast());
    return data.data;
  },
};
