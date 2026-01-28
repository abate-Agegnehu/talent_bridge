import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function SelectField({
  label,
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  const id = props.id ?? props.name;

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <select
        id={id}
        className={cn(
          "w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none",
          "border-input focus:border-ring focus:ring-1 focus:ring-ring",
          error && "border-destructive focus:border-destructive"
        )}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <span className="mt-1 block text-xs text-destructive">
          {error}
        </span>
      ) : null}
    </label>
  );
}

