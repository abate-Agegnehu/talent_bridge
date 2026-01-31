"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

type Internship = {
  id: number;
  companyId: number;
  title: string;
  description: string;
  requirements?: string | null;
  responsibilities?: string | null;
  location: string;
  type: "ONSITE" | "REMOTE" | "HYBRID";
  duration: string;
  stipend?: number | null;
  applicationDeadline: string;
  status: "OPEN" | "CLOSED";
};

export default function ApplyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [coverLetter, setCoverLetter] = useState(
    "I am writing to express my strong interest in this internship opportunity. I have experience with React and Node.js..."
  );
  const [resumeUrl, setResumeUrl] = useState<string>("https://example.com/my-resume.pdf");
  const [portfolioUrl, setPortfolioUrl] = useState<string>("https://github.com/myusername");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await fetch("/api/internships");
        if (!res.ok) throw new Error("Failed to fetch internships");
        const data: Internship[] = await res.json();
        setInternships(data);
      } catch (error) {
        toast({
          title: "Failed to load internships",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, [toast]);

  const openApplyDialog = (internship: Internship) => {
    setSelectedInternship(internship);
    setApplyOpen(true);
  };

  const submitApplication = async () => {
    if (!session?.student?.id || !selectedInternship) {
      toast({
        title: "Not allowed",
        description: "You must be a student to apply for internships.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        internshipId: selectedInternship.id,
        studentId: session.student.id,
        coverLetter,
        resumeUrl: resumeUrl.trim(),
        portfolioUrl: portfolioUrl.trim(),
      };
      const res = await fetch("/api/internships/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        let message = "Failed to submit application";
        try {
          const err = await res.json();
          message = err?.message ?? message;
        } catch {
          const text = await res.text().catch(() => "");
          if (text) message = text;
        }
        throw new Error(message);
      }
      toast({
        title: "Application submitted",
        description: "Your application has been sent successfully.",
      });
      setApplyOpen(false);
      setSelectedInternship(null);
    } catch (error) {
      toast({
        title: "Submission failed",
        description:
          error instanceof Error ? error.message : "Please check your inputs and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) return <div>Loading session...</div>;
  if (!session.student) return <div>Access Denied. You must be a student to view this page.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Available Internships</h2>
        <Button variant="outline" onClick={() => router.back()}>Back</Button>
      </div>

      {loading ? (
        <div>Loading internships...</div>
      ) : internships.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No internships available at the moment.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {internships.map((internship) => (
            <Card key={internship.id} className="border">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{internship.title}</CardTitle>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {internship.location} • {internship.type} • {internship.duration}
                    </div>
                  </div>
                  <Badge variant={internship.status === "OPEN" ? "secondary" : "default"}>
                    {internship.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Deadline: {format(new Date(internship.applicationDeadline), "MMM d, yyyy")}
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    {internship.description}
                  </div>
                  {internship.requirements && (
                    <div className="text-sm">
                      <span className="font-medium">Requirements:</span> {internship.requirements}
                    </div>
                  )}
                  {internship.responsibilities && (
                    <div className="text-sm">
                      <span className="font-medium">Responsibilities:</span> {internship.responsibilities}
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    disabled={internship.status !== "OPEN"}
                    onClick={() => openApplyDialog(internship)}
                  >
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for {selectedInternship?.title}</DialogTitle>
            <DialogDescription>
              Submit your application. Make sure your resume and portfolio links are accessible.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Letter</label>
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write a brief cover letter..."
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Resume URL</label>
              <Input
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://example.com/my-resume.pdf"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Portfolio URL</label>
              <Input
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/myusername"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitApplication} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
