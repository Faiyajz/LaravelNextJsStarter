import type { FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import { notify } from "@/modules/shared";

import { fabricService } from "@/modules/admin/fabrics/services/fabric.service";
import { FabricForm, type FabricFormValues } from "@/modules/admin/fabrics/forms/FabricForm";

const INITIAL_VALUES: FabricFormValues = {
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

export default function FabricCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: FabricFormValues,
    helpers: FormikHelpers<FabricFormValues>,
    image: File | null,
  ) => {
    try {
      const fd = new FormData();
      (Object.keys(values) as (keyof FabricFormValues)[]).forEach((key) => {
        const v = values[key];

        if (v === 0) fd.append(String(key), "0");
        else if (v !== "" && v !== null && v !== undefined) {
          fd.append(String(key), String(v));
        }
      });

      if (image) fd.append("image", image);

      await fabricService.create(fd);

      notify.success("Fabric created successfully");
      navigate("/admin/fabrics");
    } catch {
      notify.error("Failed to create fabric");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Add New Fabric
      </h2>

      <FabricForm
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit}
        submitText="Create Fabric"
        submittingText="Creating..."
        onCancel={() => navigate("/admin/fabrics")}
        formKey="fabric-create"
      />
    </div>
  );
}
