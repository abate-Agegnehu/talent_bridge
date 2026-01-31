"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

type Acceptance = {
  id: number;
  internship: { id: number; title: string; company: { id: number; name?: string } };
  company: { id: number; name?: string };
  department?: { id: number; name?: string } | null;
  letter: string;
  createdAt: string;
};

export default function AcceptancePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [acceptances, setAcceptances] = useState<Acceptance[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<number | null>(null);

  useEffect(() => {
    const sid = session?.student?.id;
    if (!sid) return;
    const fetchAcceptances = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/students/${sid}/internship-acceptances`);
        if (!res.ok) throw new Error("Failed to fetch acceptance letters");
        const data: Acceptance[] = await res.json();
        setAcceptances(data);
      } catch (error) {
        toast({
          title: "Failed to load acceptance letters",
          description: error instanceof Error ? error.message : "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAcceptances();
  }, [session, toast]);

  const sendToDepartment = async (acc: Acceptance) => {
    const depId = session?.student?.departmentId;
    if (!depId) {
      toast({
        title: "Cannot send",
        description: "No department linked to your student profile.",
        variant: "destructive",
      });
      return;
    }
    setSendingId(acc.id);
    try {
      const res = await fetch(`/api/internships/acceptances/${acc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departmentId: depId }),
      });
      if (!res.ok) {
        let message = "Failed to send to department";
        try {
          const err = await res.json();
          message = err?.message ?? message;
        } catch {}
        throw new Error(message);
      }
      const updated = await res.json();
      setAcceptances((prev) =>
        prev.map((a) => (a.id === acc.id ? { ...a, department: updated.department } : a))
      );
      toast({ title: "Acceptance sent to department" });
    } catch (error) {
      toast({
        title: "Send failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingId(null);
    }
  };

  if (!session) return <div>Loading session...</div>;
  if (!session.student) return <div>Access Denied. You must be a student to view this page.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">Acceptance Letters</h2>

      {loading ? (
        <Card>
          <CardContent className="pt-6">Loading acceptance letters...</CardContent>
        </Card>
      ) : acceptances.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-muted-foreground">
            No acceptance letters found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {acceptances.map((acc) => (
            <Card key={acc.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  {acc.internship.title} — {acc.company.name ?? "Company"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Received on {format(new Date(acc.createdAt), "MMM d, yyyy h:mm a")}
                </div>
                <div className="p-3 rounded-md border bg-card">{acc.letter}</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={acc.department ? "default" : "secondary"}>
                      {acc.department ? `Sent to ${acc.department.name ?? "Department"}` : "Not sent"}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => sendToDepartment(acc)}
                    disabled={!!acc.department || sendingId === acc.id}
                  >
                    {sendingId === acc.id ? "Sending..." : acc.department ? "Sent" : "Send to Department"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
