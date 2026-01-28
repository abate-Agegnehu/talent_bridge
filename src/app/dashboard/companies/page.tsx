"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">Company Requests</h2>
      <Card>
        <CardHeader>
          <CardTitle>Company Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
