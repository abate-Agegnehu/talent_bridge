"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { postJson } from "../../_lib/http";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UniversitySignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await postJson("/api/universities", { name, email, password });
      setSuccess("University account created successfully!");
      setTimeout(() => router.push("/login"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-primary">TalentBridge</span>
        </div>

        {/* Subtitle */}
        <p className="text-center text-muted-foreground mb-8">
          Create a university account.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              University Name
            </label>
            <Input
              type="text"
              name="name"
              placeholder="Your university name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              Email
            </label>
            <Input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="university@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              Password
            </label>
            <Input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 px-4 py-2.5 text-sm text-green-700 dark:text-green-400">
              {success}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create University Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Want a different account type?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:text-primary/90 hover:underline"
            >
              Go back
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
