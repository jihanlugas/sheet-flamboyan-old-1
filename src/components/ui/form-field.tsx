import { cloneElement, type ReactElement } from "react";

type FormControlProps = {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "false" | "true";
  id?: string;
};

type FormFieldProps = {
  children: ReactElement<FormControlProps>;
  error?: string;
  hint?: string;
  id: string;
  label: string;
  required?: boolean;
};

export function FormField({
  children,
  error,
  hint,
  id,
  label,
  required = false,
}: FormFieldProps) {
  const describedBy = [
    children.props["aria-describedby"],
    hint ? `${id}-hint` : undefined,
    error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(" ");
  const control = cloneElement(children, {
    id,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": error ? true : children.props["aria-invalid"],
  });

  return (
    <div className="space-y-2">
      <label className="block" htmlFor={id}>
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-danger">
            Wajib
          </span>
        )}
      </label>
      {control}
      {hint && (
        <p className="text-helper" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-sm font-medium leading-5 text-danger" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
