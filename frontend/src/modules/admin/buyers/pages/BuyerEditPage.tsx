import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { buyerService } from "@/modules/admin/buyers/services/buyer.service";
import { Button, notify } from "@/modules/shared";

const buyerEditSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  company_name: Yup.string().required("Company name is required"),
  country: Yup.string().required("Country is required"),
  phone: Yup.string().nullable(),
});

export default function BuyerEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      company_name: "",
      country: "",
      phone: "",
    },
    validationSchema: buyerEditSchema,
    onSubmit: async (values) => {
      if (!id) return;
      try {
        await buyerService.update(id, {
          ...values,
          phone: values.phone || null,
        });
        notify.success("Buyer updated successfully");
        navigate(`/admin/buyers/${id}`);
      } catch {
        notify.error("Failed to update buyer");
      }
    },
  });

  useEffect(() => {
    let ignore = false;

    const fetchBuyer = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const buyer = await buyerService.getById(id);
        if (!ignore) {
          formik.setValues({
            name: buyer.user?.name ?? "",
            email: buyer.user?.email ?? "",
            company_name: buyer.company_name ?? "",
            country: buyer.country ?? "",
            phone: buyer.phone ?? "",
          });
        }
      } catch {
        notify.error("Failed to load buyer");
        navigate("/admin/buyers");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchBuyer();

    return () => {
      ignore = true;
    };
  }, [id, navigate]);

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
        to={`/admin/buyers/${id}`}
        className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
      >
        ← Back to Buyer
      </Link>

      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Buyer</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              {...formik.getFieldProps("company_name")}
            />
            {formik.touched.company_name && formik.errors.company_name && (
              <p className="text-sm text-red-600 mt-1">
                {formik.errors.company_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              {...formik.getFieldProps("country")}
            />
            {formik.touched.country && formik.errors.country && (
              <p className="text-sm text-red-600 mt-1">
                {formik.errors.country}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              {...formik.getFieldProps("phone")}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/admin/buyers/${id}`)}
          >
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
