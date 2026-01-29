import { useFormikContext, getIn, type FormikValues } from "formik";

type Option = {
  label: string;
  value: string | number;
};

type SelectFieldProps = {
  name: string;
  label: string;
  options: Option[];
  required?: boolean;
  containerClassName?: string;
};

export function SelectField({
  name,
  label,
  options,
  required,
  containerClassName,
}: SelectFieldProps) {
  const { getFieldProps, errors, touched } = useFormikContext<FormikValues>();

  const error = getIn(touched, name) && getIn(errors, name);

  return (
    <div className={containerClassName}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required ? "*" : null}
      </label>

      <select
        id={name}
        className={[
          "mt-1 block w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-primary focus:border-primary",
          error ? "border-red-500" : "border-gray-300",
        ].join(" ")}
        {...getFieldProps(name)}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
