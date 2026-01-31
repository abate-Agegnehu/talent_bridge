"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function StudentsPage() {
  const { data: session } = useSession();
  const [assigned, setAssigned] = useState<any[]>([]);
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [weeklyOpen, setWeeklyOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [weeklyReports, setWeeklyReports] = useState<any[]>([]);
  const [weeklyLoading, setWeeklyLoading] = useState(false);

  useEffect(() => {
    const aid = session?.advisor?.id;
    if (!aid) return;
    const load = async () => {
      setLoadingAssigned(true);
      try {
        const res = await fetch(`/api/advisors/${aid}/students`);
        if (!res.ok) throw new Error("Failed to fetch assigned students");
        const data = await res.json();
        setAssigned(Array.isArray(data) ? data : []);
      } catch {
        setAssigned([]);
      } finally {
        setLoadingAssigned(false);
      }
    };
    load();
  }, [session]);

  const openWeekly = async (student: any) => {
    setSelectedStudent(student);
    setWeeklyOpen(true);
    setWeeklyLoading(true);
    try {
      const res = await fetch(`/api/students/${student.id}/weekly-reports`);
      if (!res.ok) throw new Error("Failed to fetch weekly reports");
      const data = await res.json();
      setWeeklyReports(Array.isArray(data) ? data : []);
    } catch {
      setWeeklyReports([]);
    } finally {
      setWeeklyLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">Assigned Students</h2>

      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>Your assigned students list.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingAssigned ? (
            <div>Loading assigned students...</div>
          ) : assigned.length === 0 ? (
            <div className="text-sm text-muted-foreground">No assigned students</div>
          ) : (
            <div className="space-y-3">
              {assigned.map((item) => {
                const st = item?.student ?? item;
                return (
                  <div key={`${st.id}-${st.user?.id}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{(st.user?.name ?? `S${st.id}`).slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-foreground">{st.user?.name ?? `Student ${st.id}`}</p>
                        <p className="text-xs text-muted-foreground">{st.user?.email ?? ""}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => openWeekly(st)}>
                      Weekly Reports
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={weeklyOpen} onOpenChange={(open) => !open && setWeeklyOpen(false)}>
        <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Weekly Reports</DialogTitle>
            <DialogDescription>
              {selectedStudent ? `Reports for ${selectedStudent.user?.name ?? `Student ${selectedStudent.id}`}` : ""}
            </DialogDescription>
          </DialogHeader>
          {weeklyLoading ? (
            <div>Loading weekly reports...</div>
          ) : weeklyReports.length === 0 ? (
            <div className="text-sm text-muted-foreground">No weekly reports</div>
          ) : (
            <div className="space-y-3">
              {weeklyReports.map((wr) => (
                <div key={wr.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Week {wr.weekNumber}</span>
                    {wr.createdAt && <span className="text-xs text-muted-foreground">{new Date(wr.createdAt).toLocaleDateString()}</span>}
                  </div>
                  <div className="mt-2 text-sm">{wr.activity}</div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
