import { useFormik } from "formik";
import { isAxiosError } from "axios";
import { useNavigate, Link } from "react-router-dom";
import { PublicLayout } from "@/modules/shared";
import { buyerRegisterSchema } from "@/modules/shared";
import { Button } from "@/modules/shared";
import { useAuth } from "@/modules/auth";

export default function BuyerRegisterPage() {
  const navigate = useNavigate();
  const { registerBuyer } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      company_name: "",
      country: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: buyerRegisterSchema,
    onSubmit: async (values) => {
      try {
        await registerBuyer(
          values.name,
          values.email,
          values.company_name,
          values.country,
          values.phone || null,
          values.password,
          values.password_confirmation,
        );
        navigate("/buyer");
      } catch (error) {
        if (isAxiosError(error)) {
          const errors = error.response?.data?.errors;
          if (errors && typeof errors === "object") {
            const fieldErrors: Record<string, string> = {};
            for (const [field, messages] of Object.entries(errors)) {
              if (Array.isArray(messages) && messages.length > 0) {
                fieldErrors[field] = String(messages[0]);
              }
            }
            formik.setErrors(fieldErrors);
          }
        } else {
          console.error("Buyer registration failed:", error);
        }
      }
    },
  });

  return (
    <PublicLayout>
      <div className="mx-auto flex max-w-md items-center justify-center px-6 py-16">
        <div className="w-full space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-500 text-center">
            Buyer Portal
          </p>
          <h2 className="mt-2 text-3xl font-bold text-center text-gray-900">
            Create your buyer account
          </h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className={`mt-1 block w-full px-3 py-2 border ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`mt-1 block w-full px-3 py-2 border ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="company_name"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                id="company_name"
                type="text"
                className={`mt-1 block w-full px-3 py-2 border ${
                  formik.touched.company_name && formik.errors.company_name
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                {...formik.getFieldProps("company_name")}
              />
              {formik.touched.company_name && formik.errors.company_name && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.company_name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                id="country"
                type="text"
                className={`mt-1 block w-full px-3 py-2 border ${
                  formik.touched.country && formik.errors.country
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                {...formik.getFieldProps("country")}
              />
              {formik.touched.country && formik.errors.country && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.country}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone (optional)
              </label>
              <input
                id="phone"
                type="tel"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                {...formik.getFieldProps("phone")}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className={`mt-1 block w-full px-3 py-2 border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                type="password"
                autoComplete="new-password"
                className={`mt-1 block w-full px-3 py-2 border ${
                  formik.touched.password_confirmation &&
                  formik.errors.password_confirmation
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                {...formik.getFieldProps("password_confirmation")}
              />
              {formik.touched.password_confirmation &&
                formik.errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.password_confirmation}
                  </p>
                )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have a buyer account?{" "}
              <Link
                to="/buyer/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
        </div>
      </div>
    </PublicLayout>
  );
}
