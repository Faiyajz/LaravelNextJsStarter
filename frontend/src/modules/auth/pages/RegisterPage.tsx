import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { registerSchema } from "@/modules/shared";
import { Button } from "@/modules/shared";
import { useAuth } from "@/modules/auth/contexts/auth-context";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        await register(
          values.name,
          values.email,
          values.password,
          values.password_confirmation,
        );
        navigate("/admin");
      } catch (error) {
        console.error("Registration failed:", error);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Create your account
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
              Already have an account?{" "}
              <Link
                to="/admin/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
