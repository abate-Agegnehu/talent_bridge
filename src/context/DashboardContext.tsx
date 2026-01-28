"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Role } from "@/constants/menus";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface DashboardContextType {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType>({
  user: null,
  role: null,
  isLoading: true,
});

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isContextLoading, setIsContextLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && session?.user) {
      const userData: User = {
        id: Number(session.user.id),
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role as Role,
      };
      setUser(userData);
      setRole(userData.role);
    } else if (status === "unauthenticated") {
      setUser(null);
      setRole(null);
    }
    
    setIsContextLoading(false);
  }, [session, status]);

  return (
    <DashboardContext.Provider value={{ user, role, isLoading: isContextLoading }}>
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
