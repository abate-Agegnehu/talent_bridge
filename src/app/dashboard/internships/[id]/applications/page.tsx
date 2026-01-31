"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ExternalLink, FileText, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function InternshipApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [letter, setLetter] = useState("");
  const [testOpen, setTestOpen] = useState(false);
  const [projectDescription, setProjectDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [advisorOptions, setAdvisorOptions] = useState<any[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatText, setChatText] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const [chatFile, setChatFile] = useState<File | null>(null);
  const bottomChatRef = useRef<HTMLDivElement | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [weeklyOpen, setWeeklyOpen] = useState(false);
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [weeklyActivity, setWeeklyActivity] = useState("");
  const [weeklySending, setWeeklySending] = useState(false);
  const [finalOpen, setFinalOpen] = useState(false);
  const [finalSending, setFinalSending] = useState(false);
  const [finalSupervisorName, setFinalSupervisorName] = useState<string>("");
  const [finalSignature, setFinalSignature] = useState<string>("");
  const [finalScores, setFinalScores] = useState({
    punctuality: 0,
    reliability: 0,
    independenceInWork: 0,
    communication: 0,
    professionalism: 0,
    speedOfWork: 0,
    accuracy: 0,
    engagement: 0,
    neededForWork: 0,
    cooperation: 0,
    technicalSkills: 0,
    organizationalSkills: 0,
    projectTaskSupport: 0,
    responsibility: 0,
    teamQuality: 0,
  });
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectLetter, setRejectLetter] = useState("");

  const internshipId = params.id;

  useEffect(() => {
    if (session?.company?.id && internshipId) {
      fetchApplications(session.company.id, internshipId as string);
    }
  }, [session, internshipId]);

  const fetchApplications = async (companyId: number, internshipId: string) => {
    try {
      const response = await fetch(
        `/api/internships/applications/companies/${companyId}/internship/${internshipId}`
      );
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAcceptance = (app: any) => {
    setSelectedApplication(app);
    setLetter(
      `Dear ${app.student?.user?.name ?? "student"},\n\nWe are pleased to offer you the internship position for "${app.internship?.title ?? "our program"}".\n\nBest regards,\n${session?.company ? "Company" : ""}`
    );
    setAcceptOpen(true);
  };

  const mapAdvisor = (item: any) => {
    const adv = item?.advisor ?? item;
    const uidUnknown = adv?.user?.id ?? adv?.userId;
    const uid = typeof uidUnknown === "number" ? uidUnknown : Number(uidUnknown);
    return {
      id: adv?.id ?? item?.advisorId ?? 0,
      userId: Number.isFinite(uid) && uid > 0 ? uid : 0,
      user: {
        id: Number.isFinite(uid) && uid > 0 ? uid : 0,
        name: adv?.user?.name ?? `Advisor ${adv?.id ?? item?.advisorId ?? ""}`,
        email: adv?.user?.email ?? "",
      },
      departmentId: adv?.departmentId ?? 0,
    };
  };

  const loadConversation = async (advisor: any) => {
    const meUnknown = session?.user?.id;
    const me = typeof meUnknown === "number" ? meUnknown : Number(meUnknown);
    if (!advisor?.user?.id || !Number.isFinite(me)) return;
    setChatLoading(true);
    try {
      const res = await fetch(`/api/messages/conversation?senderId=${me}&receiverId=${advisor.user.id}`);
      if (!res.ok) throw new Error("Failed to load conversation");
      const data = await res.json();
      setChatMessages(data);
    } catch (error) {
      toast({
        title: "Failed to load conversation",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setChatLoading(false);
    }
  };

  const openChatWithAdvisor = async (app: any) => {
    setSelectedApplication(app);
    setDetailsOpen(false);
    try {
      const res = await fetch(`/api/students/${app.student.id}/advisors`);
      if (!res.ok) throw new Error("Failed to fetch assigned advisors");
      const raw = await res.json();
      const mapped = (Array.isArray(raw) ? raw : []).map(mapAdvisor);
      setAdvisorOptions(mapped);
      const first = mapped[0] ?? null;
      setSelectedAdvisor(first);
      if (first) {
        await loadConversation(first);
      } else {
        setChatMessages([]);
      }
      setChatText("");
      setChatOpen(true);
    } catch (error) {
      toast({
        title: "Failed to open chat",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const sendChatMessage = async () => {
    const meUnknown = session?.user?.id;
    const me = typeof meUnknown === "number" ? meUnknown : Number(meUnknown);
    if (!selectedAdvisor?.user?.id || !Number.isFinite(me)) return;
    if (!chatText.trim() && !chatFile) return;
    setChatSending(true);
    try {
      let fileMeta:
        | {
            fileUrl: string;
            fileName: string;
            fileType: string;
            fileSize: number;
          }
        | null = null;
      if (chatFile) {
        const fd = new FormData();
        fd.append("file", chatFile);
        const up = await fetch("/api/messages/upload", {
          method: "POST",
          body: fd,
        });
        if (!up.ok) {
          throw new Error("File upload failed");
        }
        const uploaded = await up.json();
        fileMeta = {
          fileUrl: uploaded.fileUrl,
          fileName: uploaded.fileName,
          fileType: uploaded.fileType,
          fileSize: uploaded.fileSize,
        };
      }

      const body: any = { receiverId: Number(selectedAdvisor.user.id) };
      body.senderId = Number(me);
      if (chatText.trim()) body.text = chatText.trim();
      if (fileMeta) {
        body.messageType = chatText.trim() ? undefined : "FILE";
        Object.assign(body, fileMeta);
      }

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        let msg = "Failed to send message";
        try {
          const err = await res.json();
          msg = err?.message ?? msg;
        } catch {}
        throw new Error(msg);
      }
      const msg = await res.json();
      setChatMessages((prev) => [...prev, msg]);
      setChatText("");
      setChatFile(null);
      bottomChatRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      toast({
        title: "Send failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setChatSending(false);
    }
  };

  const openWeeklyReport = (app: any) => {
    setSelectedApplication(app);
    setWeekNumber(1);
    setWeeklyActivity("");
    setWeeklyOpen(true);
  };

  const markComplete = async (app: any) => {
    setSelectedApplication(app);
    try {
      await fetch(
        `/api/internships/applications/student/${app.student.id}/internship/${internshipId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "COMPLETED" }),
        }
      );
      await fetchApplications(Number(session?.company?.id), String(internshipId));
      setFinalSupervisorName(session?.company?.user?.name ?? "");
      toast({ title: "Marked as complete" });
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const openFinalEvaluation = (app: any) => {
    setSelectedApplication(app);
    setFinalSupervisorName(session?.company?.user?.name ?? "");
    setFinalSignature("");
    setFinalScores({
      punctuality: 0,
      reliability: 0,
      independenceInWork: 0,
      communication: 0,
      professionalism: 0,
      speedOfWork: 0,
      accuracy: 0,
      engagement: 0,
      neededForWork: 0,
      cooperation: 0,
      technicalSkills: 0,
      organizationalSkills: 0,
      projectTaskSupport: 0,
      responsibility: 0,
      teamQuality: 0,
    });
    setFinalOpen(true);
  };

  const computeTotalPercentage = () => {
    const gpMax = 25;
    const psMax = 25;
    const profMax = 50;
    const gp =
      finalScores.punctuality +
      finalScores.reliability +
      finalScores.independenceInWork +
      finalScores.communication +
      finalScores.professionalism;
    const ps =
      finalScores.speedOfWork +
      finalScores.accuracy +
      finalScores.engagement +
      finalScores.neededForWork +
      finalScores.cooperation;
    const prof =
      finalScores.technicalSkills +
      finalScores.organizationalSkills +
      finalScores.projectTaskSupport +
      finalScores.responsibility +
      finalScores.teamQuality;
    const total =
      (gp / gpMax) * 25 +
      (ps / psMax) * 25 +
      (prof / profMax) * 50;
    return Math.round(total);
  };

  const submitFinalEvaluation = async () => {
    if (!selectedApplication || !session?.company?.id) return;
    setFinalSending(true);
    try {
      const payload = {
        supervisorName: finalSupervisorName.trim() || (session?.company?.user?.name ?? "Supervisor"),
        studentId: Number(selectedApplication.student.id),
        companyId: Number(session.company.id),
        punctuality: Number(finalScores.punctuality),
        reliability: Number(finalScores.reliability),
        independenceInWork: Number(finalScores.independenceInWork),
        communication: Number(finalScores.communication),
        professionalism: Number(finalScores.professionalism),
        speedOfWork: Number(finalScores.speedOfWork),
        accuracy: Number(finalScores.accuracy),
        engagement: Number(finalScores.engagement),
        neededForWork: Number(finalScores.neededForWork),
        cooperation: Number(finalScores.cooperation),
        technicalSkills: Number(finalScores.technicalSkills),
        organizationalSkills: Number(finalScores.organizationalSkills),
        projectTaskSupport: Number(finalScores.projectTaskSupport),
        responsibility: Number(finalScores.responsibility),
        teamQuality: Number(finalScores.teamQuality),
        totalPercentage: computeTotalPercentage(),
        supervisorSignature: finalSignature.trim() || null,
      };
      const res = await fetch("/api/final-evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = "Failed to submit final evaluation";
        try {
          const err = await res.json();
          msg = err?.message ?? msg;
        } catch {}
        throw new Error(msg);
      }
      toast({ title: "Final evaluation submitted" });
      setFinalOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      toast({
        title: "Submit failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setFinalSending(false);
    }
  };

  const submitWeeklyReport = async () => {
    if (!selectedApplication || !session?.company?.id) return;
    if (!weeklyActivity.trim() || !Number.isFinite(Number(weekNumber))) return;
    setWeeklySending(true);
    try {
      const payload = {
        companyId: Number(session.company.id),
        studentId: Number(selectedApplication.student.id),
        weekNumber: Number(weekNumber),
        activity: weeklyActivity.trim(),
      };
      const res = await fetch("/api/weekly-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = "Failed to submit weekly report";
        try {
          const err = await res.json();
          msg = err?.message ?? msg;
        } catch {}
        throw new Error(msg);
      }
      toast({ title: "Weekly report submitted" });
      setWeeklyOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      toast({
        title: "Submit failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setWeeklySending(false);
    }
  };

  const sendAcceptance = async () => {
    if (!selectedApplication || !session?.company?.id || !internshipId) return;
    setSending(true);
    try {
      const payload = {
        internshipId: Number(internshipId),
        studentId: Number(selectedApplication.student.id),
        companyId: Number(session.company.id),
        letter,
        status: "ACCEPTED",
      };
      const res = await fetch("/api/internships/acceptances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = "Failed to send acceptance letter";
        try {
          const err = await res.json();
          msg = err?.message ?? msg;
        } catch {}
        throw new Error(msg);
      }
      await fetch(
        `/api/internships/applications/student/${selectedApplication.student.id}/internship/${internshipId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ACCEPTED" }),
        }
      );
      toast({ title: "Acceptance letter sent" });
      setAcceptOpen(false);
      setSelectedApplication(null);
      await fetchApplications(Number(session.company.id), String(internshipId));
    } catch (error) {
      toast({
        title: "Send failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const openTestProject = (app: any) => {
    setSelectedApplication(app);
    setProjectDescription("");
    setTestOpen(true);
  };

  const sendTestProject = async () => {
    if (!selectedApplication || !session?.company?.id || !internshipId) return;
    setSending(true);
    try {
      const payload = {
        internshipId: Number(internshipId),
        studentId: Number(selectedApplication.student.id),
        companyId: Number(session.company.id),
        description: projectDescription,
      };
      const res = await fetch("/api/internships/test-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = "Failed to send test project";
        try {
          const err = await res.json();
          msg = err?.message ?? msg;
        } catch {}
        throw new Error(msg);
      }
      toast({ title: "Test project sent" });
      setTestOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      toast({
        title: "Send failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const rejectApplication = async (app: any) => {
    setSelectedApplication(app);
    try {
      await fetch(
        `/api/internships/applications/student/${app.student.id}/internship/${internshipId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "REJECTED" }),
        }
      );
      toast({ title: "Application rejected" });
      await fetchApplications(Number(session?.company?.id), String(internshipId));
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const openRejection = (app: any) => {
    setSelectedApplication(app);
    setRejectLetter(
      `Dear ${app.student?.user?.name ?? "student"},\n\nThank you for your interest in "${app.internship?.title ?? "our program"}". After careful consideration, we will not be moving forward with your application at this time.\n\nWe appreciate the time you invested and wish you success in your future endeavors.\n\nBest regards,\n${session?.company ? "Company" : ""}`
    );
    setRejectOpen(true);
  };

  const sendRejection = async () => {
    if (!selectedApplication || !session?.company?.id || !internshipId) return;
    setSending(true);
    try {
      const payload = {
        internshipId: Number(internshipId),
        studentId: Number(selectedApplication.student.id),
        companyId: Number(session.company.id),
        letter: rejectLetter,
        status: "REJECTED",
      };
      const res = await fetch("/api/internships/acceptances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = "Failed to send rejection letter";
        try {
          const err = await res.json();
          msg = err?.message ?? msg;
        } catch {}
        throw new Error(msg);
      }
      await fetch(
        `/api/internships/applications/student/${selectedApplication.student.id}/internship/${internshipId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "REJECTED" }),
        }
      );
      toast({ title: "Rejection letter sent" });
      setRejectOpen(false);
      setSelectedApplication(null);
      await fetchApplications(Number(session.company.id), String(internshipId));
    } catch (error) {
      toast({
        title: "Send failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (!session) return <div>Loading session...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Internship Applications</h2>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Internships
        </Button>
      </div>

      {loading ? (
        <div>Loading applications...</div>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No applications found for this internship.
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{app.student.user.name}</div>
                        <div className="text-xs text-muted-foreground">Year {app.student.year}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{app.student.user.email}</TableCell>
                  <TableCell>{format(new Date(app.appliedAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={app.status === "PENDING" ? "secondary" : "default"}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {app.status === "ACCEPTED" ? (
                        <>
                          <Button variant="secondary" size="sm" onClick={() => openChatWithAdvisor(app)}>
                            Chat with Advisor
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openWeeklyReport(app)}>
                            Submit Weekly Report
                          </Button>
                          <Button size="sm" onClick={() => markComplete(app)}>
                            Complete
                          </Button>
                        </>
                      ) : app.status === "COMPLETED" ? (
                        <>
                          <Button variant="secondary" size="sm" onClick={() => openFinalEvaluation(app)}>
                            Submit Final Evaluation
                          </Button>
                        </>
                      ) : app.status === "REJECTED" ? (
                        <>
                          <Button variant="secondary" size="sm" onClick={() => openRejection(app)}>
                            Send Rejection Letter
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="secondary" size="sm" onClick={() => openAcceptance(app)}>
                            Send Acceptance
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openTestProject(app)}>
                            Send Test Project
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => rejectApplication(app)}>
                            Reject
                          </Button>
                        </>
                      )}
                      <Button size="sm" onClick={() => { setSelectedApplication(app); setDetailsOpen(true); }}>
                      View Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={detailsOpen} onOpenChange={(open) => setDetailsOpen(open)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review application for {selectedApplication?.student.user.name}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Applicant</h4>
                  <p className="font-medium">{selectedApplication.student.user.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                  <p className="font-medium">{selectedApplication.student.user.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">University</h4>
                  <p className="font-medium">University ID: {selectedApplication.student.universityId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Current Year</h4>
                  <p className="font-medium">Year {selectedApplication.student.year}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Cover Letter</h3>
                <div className="p-4 border rounded-md bg-card text-card-foreground">
                  <p className="whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Resume</h3>
                  {selectedApplication.resumeUrl ? (
                    <a
                      href={selectedApplication.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted transition-colors text-primary"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="truncate">View Resume</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  ) : (
                    <div className="p-3 border rounded-md text-muted-foreground text-sm">Not provided</div>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Portfolio</h3>
                  {selectedApplication.portfolioUrl ? (
                    <a
                      href={selectedApplication.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted transition-colors text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="truncate">View Portfolio</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  ) : (
                    <div className="p-3 border rounded-md text-muted-foreground text-sm">Not provided</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={(open) => !open && setRejectOpen(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Rejection Letter</DialogTitle>
            <DialogDescription>
              Compose and send a rejection letter to the selected student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input readOnly value={`Internship ID: ${internshipId}`} />
            <Input
              readOnly
              value={`Student: ${selectedApplication?.student?.user?.name ?? ""} (${selectedApplication?.student?.user?.email ?? ""})`}
            />
            <Textarea
              value={rejectLetter}
              onChange={(e) => setRejectLetter(e.target.value)}
              rows={8}
              placeholder="Dear student, thank you for your interest..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={sending}>
              Cancel
            </Button>
            <Button onClick={sendRejection} disabled={sending || !rejectLetter.trim()}>
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={finalOpen} onOpenChange={(open) => !open && setFinalOpen(false)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Final Evaluation</DialogTitle>
            <DialogDescription>
              Evaluate {selectedApplication?.student?.user?.name ?? "student"} across performance categories.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input readOnly value={`Internship ID: ${internshipId}`} />
            <Input
              readOnly
              value={`Student: ${selectedApplication?.student?.user?.name ?? ""} (${selectedApplication?.student?.user?.email ?? ""})`}
            />
            <Input
              value={finalSupervisorName}
              onChange={(e) => setFinalSupervisorName(e.target.value)}
              placeholder="Supervisor Name"
            />
            <div className="grid grid-cols-2 gap-3">
              <select className="border rounded-md h-10 px-3" value={finalScores.punctuality} onChange={(e) => setFinalScores((s) => ({ ...s, punctuality: Number(e.target.value) }))}>
                {[...Array(6)].map((_, i) => <option key={`punctuality-${i}`} value={i}>Punctuality {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.reliability} onChange={(e) => setFinalScores((s) => ({ ...s, reliability: Number(e.target.value) }))}>
                {[...Array(6)].map((_, i) => <option key={`reliability-${i}`} value={i}>Reliability {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.independenceInWork} onChange={(e) => setFinalScores((s) => ({ ...s, independenceInWork: Number(e.target.value) }))}>
                {[...Array(6)].map((_, i) => <option key={`independence-${i}`} value={i}>Independence In Work {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.communication} onChange={(e) => setFinalScores((s) => ({ ...s, communication: Number(e.target.value) }))}>
                {[...Array(6)].map((_, i) => <option key={`communication-${i}`} value={i}>Communication {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.professionalism} onChange={(e) => setFinalScores((s) => ({ ...s, professionalism: Number(e.target.value) }))}>
                {[...Array(6)].map((_, i) => <option key={`professionalism-${i}`} value={i}>Professionalism {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.speedOfWork} onChange={(e) => setFinalScores((s) => ({ ...s, speedOfWork: Number(e.target.value) }))}>
                {[...Array(6)].map((_, i) => <option key={`speed-${i}`} value={i}>Speed Of Work {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.accuracy} onChange={(e) => setFinalScores((s) => ({ ...s, accuracy: Number(e.target.value) }))}>
                {[...Array(6)].map((_, i) => <option key={`accuracy-${i}`} value={i}>Accuracy {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.engagement} onChange={(e) => setFinalScores((s) => ({ ...s, engagement: Number(e.target.value) }))}>
                {[...Array(6)].map((_, i) => <option key={`engagement-${i}`} value={i}>Engagement {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.neededForWork} onChange={(e) => setFinalScores((s) => ({ ...s, neededForWork: Number(e.target.value) }))}>
                {[...Array(6)].map((_, i) => <option key={`needed-${i}`} value={i}>Needed For Work {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.cooperation} onChange={(e) => setFinalScores((s) => ({ ...s, cooperation: Number(e.target.value) }))}>
                {[...Array(6)].map((_, i) => <option key={`cooperation-${i}`} value={i}>Cooperation {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.technicalSkills} onChange={(e) => setFinalScores((s) => ({ ...s, technicalSkills: Number(e.target.value) }))}>
                {[...Array(6)].map((_, i) => <option key={`tech-${i}`} value={i}>Technical Skills {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.organizationalSkills} onChange={(e) => setFinalScores((s) => ({ ...s, organizationalSkills: Number(e.target.value) }))}>
                {[...Array(6)].map((_, i) => <option key={`org-${i}`} value={i}>Organizational Skills {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.projectTaskSupport} onChange={(e) => setFinalScores((s) => ({ ...s, projectTaskSupport: Number(e.target.value) }))}>
                {[...Array(6)].map((_, i) => <option key={`pts-${i}`} value={i}>Project Task Support {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.responsibility} onChange={(e) => setFinalScores((s) => ({ ...s, responsibility: Number(e.target.value) }))}>
                {[...Array(16)].map((_, i) => <option key={`resp-${i}`} value={i}>Responsibility {i}</option>)}
              </select>
              <select className="border rounded-md h-10 px-3" value={finalScores.teamQuality} onChange={(e) => setFinalScores((s) => ({ ...s, teamQuality: Number(e.target.value) }))}>
                {[...Array(21)].map((_, i) => <option key={`team-${i}`} value={i}>Team Quality {i}</option>)}
              </select>
            </div>
            <Input
              value={finalSignature}
              onChange={(e) => setFinalSignature(e.target.value)}
              placeholder="Supervisor Signature (optional)"
            />
            <div className="text-sm text-muted-foreground">
              Total Percentage: {computeTotalPercentage()}%
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFinalOpen(false)} disabled={finalSending}>
              Cancel
            </Button>
            <Button onClick={submitFinalEvaluation} disabled={finalSending}>
              {finalSending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={acceptOpen} onOpenChange={(open) => !open && setAcceptOpen(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Acceptance Letter</DialogTitle>
            <DialogDescription>
              Compose and send an acceptance letter to the selected student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input readOnly value={`Internship ID: ${internshipId}`} />
            <Input
              readOnly
              value={`Student: ${selectedApplication?.student?.user?.name ?? ""} (${selectedApplication?.student?.user?.email ?? ""})`}
            />
            <Textarea
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              rows={8}
              placeholder="Dear student, we are pleased to offer you the internship position..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAcceptOpen(false)} disabled={sending}>
              Cancel
            </Button>
            <Button onClick={sendAcceptance} disabled={sending || !letter.trim()}>
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={chatOpen} onOpenChange={(open) => !open && setChatOpen(false)}>
        <DialogContent className="w-[90vw] max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chat with Advisor</DialogTitle>
            <DialogDescription>
              Chat with the assigned advisor of {selectedApplication?.student?.user?.name ?? "student"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 space-y-2">
              {advisorOptions.length === 0 ? (
                <div className="text-sm text-muted-foreground">No advisor assigned</div>
              ) : (
                advisorOptions.map((a) => (
                  <button
                    key={`${a.id}-${a.user.id}`}
                    onClick={() => {
                      setSelectedAdvisor(a);
                      loadConversation(a);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border ${selectedAdvisor?.id === a.id ? "bg-muted" : "bg-card"}`}
                  >
                    <Avatar>
                      <AvatarFallback>
                        {(a.user?.name ?? `Advisor ${a.id}`).slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{a.user?.name ?? `Advisor ${a.id}`}</div>
                      <div className="text-xs text-muted-foreground">{a.user?.email ?? ""}</div>
                    </div>
                    {selectedAdvisor?.id === a.id && <Badge>Active</Badge>}
                  </button>
                ))
              )}
            </div>
            <div className="col-span-8 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-3 p-2 border rounded-md">
                {chatLoading ? (
                  <div>Loading messages...</div>
                ) : chatMessages.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No messages yet</div>
                ) : (
                  chatMessages.map((m) => {
                    const myId1Unknown = session?.company?.id;
                    const myId1 = typeof myId1Unknown === "number" ? myId1Unknown : Number(myId1Unknown);
                    const myId2Unknown = session?.user?.id;
                    const myId2 = typeof myId2Unknown === "number" ? myId2Unknown : Number(myId2Unknown);
                    const isMine = m.senderId === myId1 || m.senderId === myId2;
                    return (
                      <div
                        key={m.id}
                        className={`max-w-[75%] p-3 rounded-lg border ${
                          isMine ? "ml-auto bg-primary/10 border-primary/20" : "bg-muted border-muted-foreground/20"
                        }`}
                      >
                        {m.text && <div className="mb-2">{m.text}</div>}
                        {m.fileUrl && (
                          <a
                            href={m.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-sm underline"
                          >
                            {m.fileName ?? "Attachment"}
                          </a>
                        )}
                        <div className="mt-1 text-xs text-muted-foreground">
                          {format(new Date(m.createdAt), "MMM d, yyyy h:mm a")}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomChatRef} />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  placeholder="Type a message"
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                />
                <Input
                  type="file"
                  onChange={(e) => setChatFile(e.target.files?.[0] ?? null)}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:bg-background file:text-sm"
                />
                <Button onClick={sendChatMessage} disabled={chatSending || (!chatText.trim() && !chatFile) || !selectedAdvisor}>
                  {chatSending ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={testOpen} onOpenChange={(open) => !open && setTestOpen(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Test Project</DialogTitle>
            <DialogDescription>
              Provide a brief description of the test project for the student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input readOnly value={`Internship ID: ${internshipId}`} />
            <Input
              readOnly
              value={`Student: ${selectedApplication?.student?.user?.name ?? ""} (${selectedApplication?.student?.user?.email ?? ""})`}
            />
            <Textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              rows={6}
              placeholder="implement crud operation using node js"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTestOpen(false)} disabled={sending}>
              Cancel
            </Button>
            <Button onClick={sendTestProject} disabled={sending || !projectDescription.trim()}>
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={weeklyOpen} onOpenChange={(open) => !open && setWeeklyOpen(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Weekly Report</DialogTitle>
            <DialogDescription>
              Submit a weekly report for {selectedApplication?.student?.user?.name ?? "student"}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input readOnly value={`Internship ID: ${internshipId}`} />
            <Input
              readOnly
              value={`Student: ${selectedApplication?.student?.user?.name ?? ""} (${selectedApplication?.student?.user?.email ?? ""})`}
            />
            <Input
              type="number"
              value={weekNumber}
              onChange={(e) => setWeekNumber(Number(e.target.value))}
              placeholder="Week number"
            />
            <Textarea
              value={weeklyActivity}
              onChange={(e) => setWeeklyActivity(e.target.value)}
              rows={6}
              placeholder="Completed onboarding and set up development environment."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setWeeklyOpen(false)} disabled={weeklySending}>
              Cancel
            </Button>
            <Button onClick={submitWeeklyReport} disabled={weeklySending || !weeklyActivity.trim() || !Number.isFinite(Number(weekNumber))}>
              {weeklySending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
