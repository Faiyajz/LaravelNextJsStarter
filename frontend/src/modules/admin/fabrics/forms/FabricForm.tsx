import { useEffect, useRef, useState } from "react";
import { Formik, Form, type FormikHelpers } from "formik";
import { fabricSchema } from "@/modules/shared";
import { Button } from "@/modules/shared";
import { SelectField, TextAreaField, TextField } from "@/modules/shared";
import { SupplierAsyncSelectField } from "./SupplierAsyncSelectField";
import { PRODUCTION_TYPES, type ProductionType } from "@/modules/shared";

export type FabricFormValues = {
  supplier_id: string;
  fabric_no: string;
  composition: string;
  gsm: number | string;
  qty: number | string;
  cuttable_width: number | string;
  production_type: ProductionType | "";
  construction: string;
  color_pantone_code: string;
  weave_type: string;
  finish_type: string;
  dyeing_method: string;
  printing_method: string;
  lead_time: number | string;
  moq: number | string;
  shrinkage_percent: number | string;
  remarks: string;
  fabric_selected_by: string;
};

type FabricFormProps = {
  initialValues: FabricFormValues;
  onSubmit: (
    values: FabricFormValues,
    helpers: FormikHelpers<FabricFormValues>,
    image: File | null,
  ) => void | Promise<void>;
  onCancel: () => void;
  submitText: string;
  submittingText?: string;
  cancelText?: string;
  existingImageUrl?: string;
  enableReinitialize?: boolean;
  actionsClassName?: string;
  formKey?: string;
};

export function FabricForm({
  initialValues,
  onSubmit,
  onCancel,
  submitText,
  submittingText = "Saving...",
  cancelText = "Cancel",
  existingImageUrl,
  enableReinitialize = false,
  actionsClassName = "flex gap-4",
  formKey,
}: FabricFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Formik<FabricFormValues>
      key={formKey}
      initialValues={initialValues}
      validationSchema={fabricSchema}
      onSubmit={(values, helpers) => onSubmit(values, helpers, image)}
      enableReinitialize={enableReinitialize}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6 bg-white p-6 rounded-lg shadow">
          <section>
            <h3 className="text-lg font-medium mb-4">Required Information</h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <SupplierAsyncSelectField
                name="supplier_id"
                label="Supplier"
                required
              />

              <TextField name="fabric_no" label="Fabric Number" required />

              <TextField
                name="composition"
                label="Composition"
                required
                containerClassName="sm:col-span-2"
              />

              <TextField name="gsm" label="GSM" type="number" required />
              <TextField name="qty" label="Quantity" type="number" required />
              <TextField
                name="cuttable_width"
                label="Cuttable Width"
                type="number"
                required
              />

              <SelectField
                name="production_type"
                label="Production Type"
                required
                options={PRODUCTION_TYPES.map((type) => ({
                  label: type,
                  value: type,
                }))}
              />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-4">
              Technical Details (Optional)
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <TextField name="construction" label="Construction" />
              <TextField name="color_pantone_code" label="Color/Pantone Code" />
              <TextField name="weave_type" label="Weave Type" />
              <TextField name="finish_type" label="Finish Type" />
              <TextField name="dyeing_method" label="Dyeing Method" />
              <TextField name="printing_method" label="Printing Method" />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-4">
              Business Details (Optional)
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <TextField
                name="lead_time"
                label="Lead Time (days)"
                type="number"
              />
              <TextField name="moq" label="MOQ" type="number" />
              <TextField
                name="shrinkage_percent"
                label="Shrinkage (%)"
                type="number"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6">
              <TextField name="fabric_selected_by" label="Selected By" />
              <TextAreaField name="remarks" label="Remarks" rows={3} />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-4">
              Fabric Image (Optional)
            </h3>

            {!preview && existingImageUrl && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Current:
                </p>
                <img
                  src={existingImageUrl}
                  alt="Current fabric"
                  className="w-full max-w-md h-auto rounded-lg border border-gray-300 shadow-sm"
                />
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const next = e.target.files?.[0] ?? null;
                if (preview) URL.revokeObjectURL(preview);
                if (next) {
                  setImage(next);
                  setPreview(URL.createObjectURL(next));
                } else {
                  setImage(null);
                  setPreview("");
                }
              }}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {preview && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    {existingImageUrl ? "New Preview:" : "Preview:"}
                  </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                      if (preview) URL.revokeObjectURL(preview);
                      setImage(null);
                      setPreview("");
                      if (fileRef.current) fileRef.current.value = "";
                      }}
                    >
                    Remove
                  </Button>
                </div>

                <img
                  src={preview}
                  alt="Fabric preview"
                  className="w-full max-w-md h-auto rounded-lg border border-gray-300 shadow-sm"
                />
              </div>
            )}
          </section>

          <div className={actionsClassName}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? submittingText : submitText}
            </Button>

            <Button type="button" variant="outline" onClick={onCancel}>
              {cancelText}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
