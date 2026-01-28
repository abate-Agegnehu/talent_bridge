import type { InputHTMLAttributes } from "react";

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
        className={[
          "w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none",
          "border-zinc-200 focus:border-zinc-400",
          "dark:bg-zinc-950 dark:border-zinc-800 dark:focus:border-zinc-600",
          error ? "border-red-500 focus:border-red-500 dark:border-red-500" : "",
        ].join(" ")}
        {...props}
      />
      {error ? (
        <span className="mt-1 block text-xs text-red-600 dark:text-red-400">
          {error}
        </span>
      ) : null}
    </label>
  );
}

