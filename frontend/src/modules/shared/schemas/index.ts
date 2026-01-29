import * as Yup from "yup";
import { PRODUCTION_TYPES, STOCK_TYPES } from "@/modules/shared/lib/constants";
export * from "./auth.schema";

// Supplier Schema
export const supplierSchema = Yup.object({
  country: Yup.string().required("Country is required"),
  company_name: Yup.string().required("Company name is required"),
  code: Yup.string().required("Supplier code is required"),
  email: Yup.string().email("Invalid email").nullable(),
  phone: Yup.string().nullable(),
  address: Yup.string().nullable(),
  representative_name: Yup.string().nullable(),
  representative_email: Yup.string().email("Invalid email").nullable(),
  representative_phone: Yup.string().nullable(),
});

// Fabric Schema
export const fabricSchema = Yup.object({
  supplier_id: Yup.string().uuid().required("Supplier is required"),
  fabric_no: Yup.string().required("Fabric number is required"),
  composition: Yup.string().required("Composition is required"),
  gsm: Yup.number()
    .min(1, "GSM must be at least 1")
    .required("GSM is required"),
  qty: Yup.number()
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),
  cuttable_width: Yup.number()
    .min(0, "Width cannot be negative")
    .required("Cuttable width is required"),
  production_type: Yup.string()
    .oneOf([...PRODUCTION_TYPES], "Invalid production type")
    .required("Production type is required"),
  construction: Yup.string().nullable(),
  color_pantone_code: Yup.string().nullable(),
  weave_type: Yup.string().nullable(),
  finish_type: Yup.string().nullable(),
  dyeing_method: Yup.string().nullable(),
  printing_method: Yup.string().nullable(),
  lead_time: Yup.number().min(0).nullable(),
  moq: Yup.number().min(0).nullable(),
  shrinkage_percent: Yup.number().min(0).max(100).nullable(),
  remarks: Yup.string().nullable(),
  fabric_selected_by: Yup.string().nullable(),
});

// Fabric Stock Schema
export const fabricStockSchema = Yup.object({
  fabric_id: Yup.string().uuid().required("Fabric is required"),
  type: Yup.string()
    .oneOf([...STOCK_TYPES], "Invalid stock type")
    .required("Type is required"),
  quantity: Yup.number()
    .min(0.001, "Quantity must be greater than 0")
    .required("Quantity is required"),
  reference: Yup.string().nullable(),
});

export const fabricStockFormSchema = Yup.object({
  type: Yup.string()
    .oneOf([...STOCK_TYPES], "Invalid stock type")
    .required("Type is required"),
  quantity: Yup.number()
    .min(0.001, "Quantity must be greater than 0")
    .required("Quantity is required"),
  reference: Yup.string().nullable(),
});

// Note Schema
export const noteSchema = Yup.object({
  note: Yup.string()
    .min(1, "Note cannot be empty")
    .max(5000, "Note is too long")
    .required("Note is required"),
});
