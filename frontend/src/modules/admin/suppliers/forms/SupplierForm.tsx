import { Formik, Form, type FormikHelpers } from "formik";
import { supplierSchema } from "@/modules/shared";
import { Button } from "@/modules/shared";
import { TextAreaField, TextField } from "@/modules/shared";

export type SupplierFormValues = {
  country: string;
  company_name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  representative_name: string;
  representative_email: string;
  representative_phone: string;
};

type SupplierFormProps = {
  initialValues: SupplierFormValues;
  onSubmit: (
    values: SupplierFormValues,
    helpers: FormikHelpers<SupplierFormValues>,
  ) => void | Promise<void>;
  onCancel: () => void;
  submitText: string;
  submittingText?: string;
  cancelText?: string;
  enableReinitialize?: boolean;
  actionsClassName?: string;
};

export function SupplierForm({
  initialValues,
  onSubmit,
  onCancel,
  submitText,
  submittingText = "Saving...",
  cancelText = "Cancel",
  enableReinitialize = false,
  actionsClassName = "flex gap-4",
}: SupplierFormProps) {
  return (
    <Formik<SupplierFormValues>
      initialValues={initialValues}
      validationSchema={supplierSchema}
      onSubmit={onSubmit}
      enableReinitialize={enableReinitialize}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6 bg-white p-6 rounded-lg shadow">
          {/* Required Fields */}
          <section>
            <h3 className="text-lg font-medium mb-4">Required Information</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <TextField name="country" label="Country" required />
              <TextField name="company_name" label="Company Name" required />
              <TextField name="code" label="Code" required />
            </div>
          </section>

          {/* Optional Fields */}
          <section>
            <h3 className="text-lg font-medium mb-4">
              Contact Information (Optional)
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <TextField name="email" label="Email" type="email" />
              <TextField name="phone" label="Phone" />

              <TextAreaField
                name="address"
                label="Address"
                rows={3}
                containerClassName="sm:col-span-2"
              />
            </div>
          </section>

          {/* Representative Information */}
          <section>
            <h3 className="text-lg font-medium mb-4">
              Representative Information (Optional)
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <TextField name="representative_name" label="Name" />
              <TextField
                name="representative_email"
                label="Email"
                type="email"
              />
              <TextField name="representative_phone" label="Phone" />
            </div>
          </section>

          {/* Actions */}
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
