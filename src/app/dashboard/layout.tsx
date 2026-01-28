"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import { Role } from "@/constants/menus";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { role, user, isLoading } = useDashboard();

  useEffect(() => {
    if (!isLoading && !role) {
      router.push("/login");
    }
  }, [isLoading, role, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!role) return null;

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <div className="hidden md:block fixed inset-y-0 left-0 z-40">
        <Sidebar role={role} />
      </div>
      <div className="flex flex-col flex-1 md:pl-64">
        <Header role={role} setRole={() => {}} user={user} />
        <main className="flex-1 p-6 md:p-8 pt-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
}
