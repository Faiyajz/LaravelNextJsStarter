// Generic API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  message?: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  roles?: { id: string; name: string }[];
}

// Auth Types
export interface AuthResponse {
  user: User;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface BuyerRegisterData extends RegisterData {
  company_name: string;
  country: string;
  phone?: string | null;
  account_type?: "buyer";
}

export interface Buyer {
  id: string;
  user_id: string;
  company_name: string;
  country: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface BuyerUpdateData {
  name: string;
  email: string;
  company_name: string;
  country: string;
  phone?: string | null;
}

// Supplier Types
export interface Supplier {
  id: string;
  country: string;
  company_name: string;
  code: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  representative_name: string | null;
  representative_email: string | null;
  representative_phone: string | null;
  added_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  notes?: Note[];
}

export interface SupplierFormData {
  country: string;
  company_name: string;
  code: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  representative_name?: string | null;
  representative_email?: string | null;
  representative_phone?: string | null;
}

export interface SupplierFilters {
  page?: number;
  per_page?: number;
  search?: string;
  country?: string;
  company_name?: string;
  representative_name?: string;
  date_from?: string;
  date_to?: string;
}

// Fabric Types
export interface Fabric {
  id: string;
  supplier_id: string;
  fabric_no: string;
  composition: string;
  gsm: number;
  qty: number;
  cuttable_width: number;
  production_type: "Sample Yardage" | "SMS" | "Bulk";
  construction: string | null;
  color_pantone_code: string | null;
  weave_type: string | null;
  finish_type: string | null;
  dyeing_method: string | null;
  printing_method: string | null;
  lead_time: number | null;
  moq: number | null;
  shrinkage_percent: number | null;
  remarks: string | null;
  fabric_selected_by: string | null;
  image_path: string | null;
  added_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  supplier?: Supplier;
  barcodes?: FabricBarcode[];
  stocks?: FabricStock[];
  notes?: Note[];
  current_qty?: number;
  available_balance?: number;
}

export interface FabricFormData {
  supplier_id: string;
  fabric_no: string;
  composition: string;
  gsm: number;
  qty: number;
  cuttable_width: number;
  production_type: "Sample Yardage" | "SMS" | "Bulk";
  construction?: string | null;
  color_pantone_code?: string | null;
  weave_type?: string | null;
  finish_type?: string | null;
  dyeing_method?: string | null;
  printing_method?: string | null;
  lead_time?: number | null;
  moq?: number | null;
  shrinkage_percent?: number | null;
  remarks?: string | null;
  fabric_selected_by?: string | null;
}

export interface FabricFilters {
  page?: number;
  per_page?: number;
  search?: string;
  supplier_id?: string;
  fabric_no?: string;
  composition?: string;
  production_type?: string;
  supplier?: string;
}

// Fabric Stock Types
export interface FabricStock {
  id: string;
  fabric_id: string;
  type: "IN" | "OUT";
  quantity: number;
  reference: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FabricStockFormData {
  fabric_id: string;
  type: "IN" | "OUT";
  quantity: number;
  reference?: string | null;
}

// Fabric Barcode Types
export interface FabricBarcode {
  id: string;
  fabric_id: string;
  barcode_value: string;
  created_at: string;
  updated_at: string;
}

export interface FabricBarcodeFormData {
  fabric_id: string;
}

// Note Types
export interface Note {
  id: string;
  noteable_type: string;
  noteable_id: string;
  note: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface NoteFormData {
  noteable_type: string;
  noteable_id: string;
  note: string;
}
