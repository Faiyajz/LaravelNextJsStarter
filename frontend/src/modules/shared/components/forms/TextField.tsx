import type { ComponentPropsWithoutRef } from "react";
import { useFormikContext, getIn, type FormikValues } from "formik";

type TextFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  containerClassName?: string;
} & Omit<ComponentPropsWithoutRef<"input">, "name" | "value" | "onChange" | "onBlur">;

export function TextField({
  name,
  label,
  required,
  containerClassName,
  className,
  id,
  ...rest
}: TextFieldProps) {
  const { getFieldProps, errors, touched } = useFormikContext<FormikValues>();

  const error = getIn(touched, name) && getIn(errors, name);

  return (
    <div className={containerClassName}>
      <label htmlFor={id ?? name} className="block text-sm font-medium text-gray-700">
        {label} {required ? "*" : null}
      </label>

      <input
        id={id ?? name}
        className={[
          "mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary focus:border-primary",
          error ? "border-red-500" : "border-gray-300",
          className ?? "",
        ].join(" ")}
        {...getFieldProps(name)}
        {...rest}
      />

      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
