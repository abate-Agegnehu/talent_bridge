"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MENU_ITEMS, Role } from "@/constants/menus";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  role: Role;
  className?: string;
}

export function Sidebar({ role, className }: SidebarProps) {
  const menuGroups = MENU_ITEMS[role] || [];

  return (
    <div className={cn("pb-12 min-h-screen w-64 border-r border-slate-200 bg-white", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
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
          <span className="text-2xl font-bold text-blue-500">TalentBridge</span>
        </div>
          <div className="space-y-1">
            {menuGroups.map((group, i) => (
              <div key={i} className="mb-6">
                <h4 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </h4>
                <div className="space-y-1">
                  {group.items.map((item, j) => (
                    <Button
                      key={j}
                      variant={item.active ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        item.active && "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      )}
                      asChild
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 py-2 mt-auto absolute bottom-0 w-64">
         <div className="px-4 pb-6">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
         </div>
      </div>
    </div>
  );
}
