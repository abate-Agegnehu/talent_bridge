import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function TextField({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  const id = props.id ?? props.name;

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        id={id}
        className={cn(
          "w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground",
          "border-input focus:border-ring focus:ring-1 focus:ring-ring",
          error && "border-destructive focus:border-destructive"
        )}
        {...props}
      />
      {error ? (
        <span className="mt-1 block text-xs text-destructive">
          {error}
        </span>
      ) : null}
    </label>
  );
}

