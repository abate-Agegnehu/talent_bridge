"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import { Role } from "@/constants/menus";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { role, user, isLoading, status } = useDashboard();

  useEffect(() => {
    if (!isLoading && !role) {
      router.push("/login");
    }
  }, [isLoading, role, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!role) {
    return null;
  }

  if (status === "PENDING") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
        <div className="max-w-md text-center space-y-6 bg-card p-8 rounded-xl border shadow-sm">
          <div className="h-20 w-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h1 className="text-2xl font-bold">Account Pending Approval</h1>
          <p className="text-muted-foreground">
            Your account is currently under review by the administrator. You will be notified once your account is approved.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="text-primary hover:underline font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
        <div className="max-w-md text-center space-y-6 bg-card p-8 rounded-xl border shadow-sm">
          <div className="h-20 w-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <h1 className="text-2xl font-bold">Account Rejected</h1>
          <p className="text-muted-foreground">
            We're sorry, but your account registration has been rejected. Please contact support for more information.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="text-primary hover:underline font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
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
