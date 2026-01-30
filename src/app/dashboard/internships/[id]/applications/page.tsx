"use client";

import React, { useEffect, useState } from "react";
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
import { format } from "date-fns";
import { ExternalLink, FileText, User } from "lucide-react";

export default function InternshipApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

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
                    <Button size="sm" onClick={() => setSelectedApplication(app)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedApplication} onOpenChange={(open) => !open && setSelectedApplication(null)}>
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
    </div>
  );
}
