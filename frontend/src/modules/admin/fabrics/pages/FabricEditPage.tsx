import { useEffect, useState } from "react";
import type { FormikHelpers } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notify } from "@/modules/shared";

import { fabricService } from "@/modules/admin/fabrics/services/fabric.service";
import type { FabricFormData } from "@/modules/shared";
import { FabricForm, type FabricFormValues } from "@/modules/admin/fabrics/forms/FabricForm";

const EMPTY_VALUES: FabricFormValues = {
  supplier_id: "",
  fabric_no: "",
  composition: "",
  gsm: "",
  qty: "",
  cuttable_width: "",
  production_type: "",
  construction: "",
  color_pantone_code: "",
  weave_type: "",
  finish_type: "",
  dyeing_method: "",
  printing_method: "",
  lead_time: "",
  moq: "",
  shrinkage_percent: "",
  remarks: "",
  fabric_selected_by: "",
};

export default function FabricEditPage() {
  const storageBaseUrl =
    import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage";
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] =
    useState<FabricFormValues>(EMPTY_VALUES);

  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

  useEffect(() => {
    let ignore = false;

    const fetchFabric = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const f = await fabricService.getById(id);
        setExistingImageUrl(
          f.image_path ? `${storageBaseUrl}/${f.image_path}` : "",
        );

        const nextValues: FabricFormValues = {
          supplier_id: f.supplier_id ?? "",
          fabric_no: f.fabric_no ?? "",
          composition: f.composition ?? "",
          gsm: f.gsm ?? "",
          qty: f.qty ?? "",
          cuttable_width: f.cuttable_width ?? "",
          production_type: f.production_type ?? "",
          construction: f.construction ?? "",
          color_pantone_code: f.color_pantone_code ?? "",
          weave_type: f.weave_type ?? "",
          finish_type: f.finish_type ?? "",
          dyeing_method: f.dyeing_method ?? "",
          printing_method: f.printing_method ?? "",
          lead_time: f.lead_time ?? "",
          moq: f.moq ?? "",
          shrinkage_percent: f.shrinkage_percent ?? "",
          remarks: f.remarks ?? "",
          fabric_selected_by: f.fabric_selected_by ?? "",
        };

        if (!ignore) setInitialValues(nextValues);
      } catch {
        notify.error("Failed to load fabric");
        navigate("/admin/fabrics");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchFabric();

    return () => {
      ignore = true;
    };
  }, [id, navigate, storageBaseUrl]);

  const handleSubmit = async (
    values: FabricFormValues,
    helpers: FormikHelpers<FabricFormValues>,
    image: File | null,
  ) => {
    if (!id) return;

    try {
      const payload = {
        ...values,
        gsm: Number(values.gsm),
        qty: Number(values.qty),
        cuttable_width: Number(values.cuttable_width),
        lead_time: values.lead_time ? Number(values.lead_time) : null,
        moq: values.moq ? Number(values.moq) : null,
        shrinkage_percent: values.shrinkage_percent
          ? Number(values.shrinkage_percent)
          : null,
        construction: values.construction || null,
        color_pantone_code: values.color_pantone_code || null,
        weave_type: values.weave_type || null,
        finish_type: values.finish_type || null,
        dyeing_method: values.dyeing_method || null,
        printing_method: values.printing_method || null,
        remarks: values.remarks || null,
        fabric_selected_by: values.fabric_selected_by || null,
      } as FabricFormData;

      if (image) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (v !== null && v !== undefined) fd.append(k, String(v));
        });
        fd.append("image", image);

        await fabricService.update(id, fd);
      } else {
        await fabricService.update(id, payload);
      }
      notify.success("Fabric updated successfully");
      navigate(`/admin/fabrics/${id}`);
    } catch {
      notify.error("Failed to update fabric");
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
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <Link
        to={`/admin/fabrics/${id}`}
        className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
      >
        ← Back to Fabric
      </Link>

      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Fabric</h2>

      <FabricForm
        initialValues={initialValues}
        existingImageUrl={existingImageUrl}
        onSubmit={handleSubmit}
        submitText="Update Fabric"
        submittingText="Updating..."
        onCancel={() => navigate(`/admin/fabrics/${id}`)}
        enableReinitialize
        formKey={`${initialValues.supplier_id || "new"}-${initialValues.fabric_no || "new"}`}
      />
    </div>
  );
}
