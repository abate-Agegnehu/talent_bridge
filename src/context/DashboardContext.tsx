"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Role } from "@/constants/menus";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status?: "PENDING" | "ACCEPTED" | "REJECTED";
}

interface DashboardContextType {
  user: User | null;
  role: Role | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | null;
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType>({
  user: null,
  role: null,
  status: null,
  isLoading: true,
});

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: authStatus } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [status, setStatus] = useState<"PENDING" | "ACCEPTED" | "REJECTED" | null>(null);
  const [isContextLoading, setIsContextLoading] = useState(true);

  useEffect(() => {
    if (authStatus === "loading") {
      return;
    }

    if (authStatus === "authenticated" && session?.user) {
      // @ts-ignore
      const universityStatus = session.university?.status;
      // @ts-ignore
      const companyStatus = session.company?.status;
      
      const userStatus = universityStatus || companyStatus || "ACCEPTED";

      const userData: User = {
        id: Number(session.user.id),
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role as Role,
        status: userStatus,
      };
      setUser(userData);
      setRole(userData.role);
      setStatus(userStatus);
    } else if (authStatus === "unauthenticated") {
      setUser(null);
      setRole(null);
      setStatus(null);
    }
    
    setIsContextLoading(false);
  }, [session, authStatus]);

  return (
    <DashboardContext.Provider value={{ user, role, status, isLoading: isContextLoading }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
