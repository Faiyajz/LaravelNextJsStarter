import { useEffect, useState } from "react";
import type { FormikHelpers } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notify } from "@/modules/shared";

import { supplierService } from "@/modules/admin/suppliers/services/supplier.service";
import {
  SupplierForm,
  type SupplierFormValues,
} from "@/modules/admin/suppliers/forms/SupplierForm";

const EMPTY_VALUES: SupplierFormValues = {
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

export default function SupplierEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] =
    useState<SupplierFormValues>(EMPTY_VALUES);

  useEffect(() => {
    let ignore = false;

    const fetchSupplier = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const s = await supplierService.getById(id);

        const nextValues: SupplierFormValues = {
          country: s.country ?? "",
          company_name: s.company_name ?? "",
          code: s.code ?? "",
          email: s.email ?? "",
          phone: s.phone ?? "",
          address: s.address ?? "",
          representative_name: s.representative_name ?? "",
          representative_email: s.representative_email ?? "",
          representative_phone: s.representative_phone ?? "",
        };

        if (!ignore) setInitialValues(nextValues);
      } catch {
        notify.error("Failed to load supplier");
        navigate("/admin/suppliers");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchSupplier();

    return () => {
      ignore = true;
    };
  }, [id, navigate]);

  const handleSubmit = async (
    values: SupplierFormValues,
    helpers: FormikHelpers<SupplierFormValues>,
  ) => {
    if (!id) return;

    try {
      await supplierService.update(id, values);
      notify.success("Supplier updated successfully");
      navigate(`/admin/suppliers/${id}`);
    } catch {
      notify.error("Failed to update supplier");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-0">
      <Link
        to={`/admin/suppliers/${id}`}
        className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
      >
        ← Back to Supplier
      </Link>

      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Edit Supplier
      </h2>

      <SupplierForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitText="Save Changes"
        submittingText="Saving..."
        onCancel={() => navigate(`/admin/suppliers/${id}`)}
        enableReinitialize
        actionsClassName="flex gap-3 justify-end"
      />
    </div>
  );
}
