"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InternshipStatus, InternshipType } from "@/generated/prisma/enums";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Internship = {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  location: string;
  type: InternshipType;
  duration: string;
  stipend?: number;
  applicationDeadline: string;
  status: InternshipStatus;
  createdAt: string;
};

type InternshipFormData = {
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  location: string;
  type: InternshipType;
  duration: string;
  stipend: string;
  applicationDeadline: string;
  status: InternshipStatus;
};

const initialFormData: InternshipFormData = {
  title: "",
  description: "",
  requirements: "",
  responsibilities: "",
  location: "",
  type: "ONSITE",
  duration: "",
  stipend: "",
  applicationDeadline: "",
  status: "OPEN",
};

export default function InternshipsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [formData, setFormData] = useState<InternshipFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteInternshipId, setDeleteInternshipId] = useState<number | null>(null);

  useEffect(() => {
    if (session?.company?.id) {
      fetchInternships(session.company.id);
    } else if (session !== undefined) {
      // Session loaded but no company ID (or not logged in)
      setLoading(false);
    }
  }, [session]);

  const fetchInternships = async (companyId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/internships/companies/${companyId}`);
      if (response.ok) {
        const data = await response.json();
        setInternships(data);
      } else {
        console.error("Failed to fetch internships");
        toast({
          title: "Error",
          description: "Failed to fetch internships",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching internships:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingInternship(null);
    setError(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (internship: Internship) => {
    setEditingInternship(internship);
    setFormData({
      title: internship.title,
      description: internship.description,
      requirements: internship.requirements || "",
      responsibilities: internship.responsibilities || "",
      location: internship.location,
      type: internship.type,
      duration: internship.duration,
      stipend: internship.stipend?.toString() || "",
      applicationDeadline: new Date(internship.applicationDeadline).toISOString().split('T')[0],
      status: internship.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.company?.id) return;

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        companyId: session.company.id,
        ...formData,
        stipend: formData.stipend ? parseFloat(formData.stipend) : null,
        requirements: formData.requirements || null,
        responsibilities: formData.responsibilities || null,
      };

      let response;
      if (editingInternship) {
        response = await fetch(`/api/internships/${editingInternship.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch("/api/internships", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        setIsDialogOpen(false);
        resetForm();
        fetchInternships(session.company.id);
        toast({
          title: "Success",
          description: `Internship ${editingInternship ? "updated" : "created"} successfully`,
        });
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save internship");
        toast({
          title: "Error",
          description: data.message || "Failed to save internship",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteInternshipId(id);
  };

  const handleDelete = async () => {
    if (!deleteInternshipId) return;

    try {
      const response = await fetch(`/api/internships/${deleteInternshipId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (session?.company?.id) {
          fetchInternships(session.company.id);
        }
        toast({
          title: "Success",
          description: "Internship deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete internship",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting internship:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setDeleteInternshipId(null);
    }
  };

  if (!session) return <div>Loading session...</div>;
  if (!session.company) return <div>Access Denied. You must be a company to view this page.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Manage Internships</h2>
        <Button onClick={openCreateDialog}>Create Internship</Button>
      </div>

      {loading ? (
        <div>Loading internships...</div>
      ) : internships.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No internships found. Create one to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {internships.map((internship) => (
                <TableRow key={internship.id}>
                  <TableCell className="font-medium">{internship.title}</TableCell>
                  <TableCell>{internship.location}</TableCell>
                  <TableCell>{internship.type}</TableCell>
                  <TableCell>{internship.duration}</TableCell>
                  <TableCell>{new Date(internship.applicationDeadline).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={internship.status === "OPEN" ? "default" : "secondary"}>
                      {internship.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => router.push(`/dashboard/internships/${internship.id}/applications`)}
                      >
                        Applicants
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(internship)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => confirmDelete(internship.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingInternship ? "Edit Internship" : "Create New Internship"}</DialogTitle>
          </DialogHeader>
          
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title *</label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location *</label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description *</label>
              <textarea
                id="description"
                name="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label htmlFor="requirements" className="text-sm font-medium">Requirements</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.requirements}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="responsibilities" className="text-sm font-medium">Responsibilities</label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">Type *</label>
                <select
                  id="type"
                  name="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  {Object.values(InternshipType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {editingInternship && (
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">Status *</label>
                  <select
                    id="status"
                    name="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    {Object.values(InternshipStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

             <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">Duration *</label>
                <Input
                  id="duration"
                  name="duration"
                  placeholder="e.g. 3 months"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="stipend" className="text-sm font-medium">Stipend</label>
                <Input
                  id="stipend"
                  name="stipend"
                  type="number"
                  placeholder="Optional"
                  value={formData.stipend}
                  onChange={handleInputChange}
                />
              </div>
               <div className="space-y-2">
                <label htmlFor="applicationDeadline" className="text-sm font-medium">Deadline *</label>
                <Input
                  id="applicationDeadline"
                  name="applicationDeadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : (editingInternship ? "Update Internship" : "Create Internship")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteInternshipId !== null} onOpenChange={(open) => !open && setDeleteInternshipId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the internship.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
