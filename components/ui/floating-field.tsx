"use client";

import { ReactNode } from "react";
import { tw } from "@/components/ui/styles";

type FloatingFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
  inputMode?: "decimal" | "numeric" | "text";
  min?: string;
  step?: string;
  autoComplete?: string;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  suffix?: ReactNode;
};

export function FloatingField({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  min,
  step,
  autoComplete,
  maxLength,
  disabled = false,
  required = false,
  name,
  id,
  suffix,
}: FloatingFieldProps) {
  return (
    <label className={tw("floating-field")}>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        min={min}
        step={step}
        autoComplete={autoComplete}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        required={required}
        placeholder=" "
        className={tw("floating-field__input")}
        aria-label={label}
      />
      <span className={tw("floating-field__label")} aria-hidden="true">
        {label}
      </span>
      {suffix ? <span className={tw("floating-field__suffix")}>{suffix}</span> : null}
    </label>
  );
}
