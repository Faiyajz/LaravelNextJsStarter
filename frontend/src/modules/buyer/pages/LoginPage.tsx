import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { PublicLayout } from "@/modules/shared";
import { loginSchema } from "@/modules/shared";
import { Button } from "@/modules/shared";
import { useAuth } from "@/modules/auth";

export default function BuyerLoginPage() {
  const navigate = useNavigate();
  const { loginBuyer } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        await loginBuyer(values.email, values.password);
        navigate("/buyer");
      } catch (error) {
        console.error("Buyer login failed:", error);
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
            Sign in to your buyer account
          </h2>
        </div>
        <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
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
                autoComplete="current-password"
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
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have a buyer account?{" "}
              <Link
                to="/buyer/register"
                className="font-medium text-primary hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
        </div>
      </div>
    </PublicLayout>
  );
}
