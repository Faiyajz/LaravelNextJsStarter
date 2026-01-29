import { useNavigate } from "react-router-dom";
import type { FormikHelpers } from "formik";
import { notify } from "@/modules/shared";

import { supplierService } from "@/modules/admin/suppliers/services/supplier.service";
import {
  SupplierForm,
  type SupplierFormValues,
} from "@/modules/admin/suppliers/forms/SupplierForm";

const INITIAL_VALUES: SupplierFormValues = {
  country: "",
  company_name: "",
  code: "",
  email: "",
  phone: "",
  address: "",
  representative_name: "",
  representative_email: "",
  representative_phone: "",
};

export default function SupplierCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: SupplierFormValues,
    helpers: FormikHelpers<SupplierFormValues>,
  ) => {
    try {
      await supplierService.create(values);
      notify.success("Supplier created successfully");
      navigate("/admin/suppliers");
    } catch {
      notify.error("Failed to create supplier");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-0">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Add New Supplier
      </h2>

      <SupplierForm
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit}
        submitText="Create Supplier"
        submittingText="Creating..."
        onCancel={() => navigate("/admin/suppliers")}
      />
    </div>
  );
}
