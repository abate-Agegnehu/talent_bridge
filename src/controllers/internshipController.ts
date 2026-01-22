import {
  createInternship,
  createInternshipApplication,
  getAllInternships,
  getInternshipApplicationsByCompanyIdAndInternshipId,
  getInternshipApplicationsByCompanyId,
  getInternshipApplicationsByStudentId,
  getInternshipsByCompanyId,
  updateInternshipApplicationStatus,
  InternshipApplicationPayload,
  InternshipPayload,
} from "@/services/internshipService";
import { InternshipType, ApplicationStatus } from "@/generated/prisma/enums";

type ControllerResult<T> = {
  status: number;
  body: T | { message: string };
};

type ValidationResult = {
  valid: boolean;
  message?: string;
};

function validateInternshipPayload(payload: unknown): ValidationResult {
  if (typeof payload !== "object" || payload === null) {
    return { valid: false, message: "Request body must be an object" };
  }

  const value = payload as Record<string, unknown>;
  const companyId = value.companyId;
  const title = value.title;
  const description = value.description;
  const location = value.location;
  const type = value.type;
  const duration = value.duration;
  const applicationDeadline = value.applicationDeadline;

  if (
    typeof companyId !== "number" ||
    !Number.isInteger(companyId) ||
    companyId <= 0
  ) {
    return { valid: false, message: "companyId must be a positive integer" };
  }

  if (typeof title !== "string" || title.trim().length === 0) {
    return { valid: false, message: "Title is required" };
  }

  if (typeof description !== "string" || description.trim().length === 0) {
    return { valid: false, message: "Description is required" };
  }

  if (typeof location !== "string" || location.trim().length === 0) {
    return { valid: false, message: "Location is required" };
  }

  if (
    !type ||
    !Object.values(InternshipType).includes(type as InternshipType)
  ) {
    return {
      valid: false,
      message: `Type must be one of: ${Object.values(InternshipType).join(", ")}`,
    };
  }

  if (typeof duration !== "string" || duration.trim().length === 0) {
    return { valid: false, message: "Duration is required" };
  }

  if (
    typeof applicationDeadline !== "string" ||
    applicationDeadline.trim().length === 0
  ) {
    return { valid: false, message: "Application deadline is required" };
  }

  // Validate date format
  const deadlineDate = new Date(applicationDeadline);
  if (isNaN(deadlineDate.getTime())) {
    return {
      valid: false,
      message: "Application deadline must be a valid date (ISO format)",
    };
  }

  return { valid: true };
}

function validateInternshipApplicationPayload(
  payload: unknown,
): ValidationResult {
  if (typeof payload !== "object" || payload === null) {
    return { valid: false, message: "Request body must be an object" };
  }

  const value = payload as Record<string, unknown>;
  const internshipId = value.internshipId;
  const studentId = value.studentId;
  const coverLetter = value.coverLetter;
  const resumeUrl = value.resumeUrl;
  const portfolioUrl = value.portfolioUrl;

  if (
    typeof internshipId !== "number" ||
    !Number.isInteger(internshipId) ||
    internshipId <= 0
  ) {
    return {
      valid: false,
      message: "internshipId must be a positive integer",
    };
  }

  if (
    typeof studentId !== "number" ||
    !Number.isInteger(studentId) ||
    studentId <= 0
  ) {
    return { valid: false, message: "studentId must be a positive integer" };
  }

  if (typeof coverLetter !== "string" || coverLetter.trim().length === 0) {
    return { valid: false, message: "Cover letter is required" };
  }

  if (resumeUrl !== undefined && resumeUrl !== null && typeof resumeUrl !== "string") {
    return { valid: false, message: "resumeUrl must be a string" };
  }

  if (portfolioUrl !== undefined && portfolioUrl !== null && typeof portfolioUrl !== "string") {
    return { valid: false, message: "portfolioUrl must be a string" };
  }

  return { valid: true };
}

export async function handleGetAllInternships(): Promise<
  ControllerResult<unknown>
> {
  try {
    const internships = await getAllInternships();
    return { status: 200, body: internships };
  } catch (error) {
    console.error("Error fetching internships:", error);
    return {
      status: 500,
      body: { message: "Failed to fetch internships" },
    };
  }
}

export async function handleGetInternshipsByCompanyId(
  companyId: number,
): Promise<ControllerResult<unknown>> {
  try {
    const internships = await getInternshipsByCompanyId(companyId);
    return { status: 200, body: internships };
  } catch (error) {
    console.error("Error fetching internships:", error);
    return {
      status: 500,
      body: { message: "Failed to fetch internships" },
    };
  }
}

export async function handleCreateInternship(
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateInternshipPayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const internship = await createInternship(payload as InternshipPayload);
    return { status: 201, body: internship };
  } catch (error) {
    console.error("Error creating internship:", error);

    if ((error as { code?: string }).code === "P2003") {
      return {
        status: 400,
        body: { message: "Invalid companyId - Company does not exist" },
      };
    }

    const errorMessage = (error as Error).message || "Failed to create internship";
    return {
      status: 500,
      body: { message: errorMessage },
    };
  }
}

export async function handleCreateInternshipApplication(
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateInternshipApplicationPayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const application = await createInternshipApplication(
      payload as InternshipApplicationPayload,
    );
    return { status: 201, body: application };
  } catch (error) {
    console.error("Error creating internship application:", error);

    const errorMessage = (error as Error).message;
    
    if (errorMessage?.includes("does not exist")) {
      return {
        status: 404,
        body: { message: errorMessage },
      };
    }

    if (
      errorMessage?.includes("no longer accepting") ||
      errorMessage?.includes("deadline has passed") ||
      errorMessage?.includes("already applied")
    ) {
      return {
        status: 400,
        body: { message: errorMessage },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to create internship application" },
    };
  }
}

export async function handleGetInternshipApplicationsByStudentId(
  studentId: number,
): Promise<ControllerResult<unknown>> {
  try {
    const applications = await getInternshipApplicationsByStudentId(studentId);
    return { status: 200, body: applications };
  } catch (error) {
    console.error("Error fetching internship applications:", error);

    const errorMessage = (error as Error).message;
    if (errorMessage?.includes("does not exist")) {
      return {
        status: 404,
        body: { message: errorMessage },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to fetch internship applications" },
    };
  }
}

export async function handleGetInternshipApplicationsByCompanyId(
  companyId: number,
): Promise<ControllerResult<unknown>> {
  try {
    const applications = await getInternshipApplicationsByCompanyId(companyId);
    return { status: 200, body: applications };
  } catch (error) {
    console.error("Error fetching internship applications:", error);

    const errorMessage = (error as Error).message;
    if (errorMessage?.includes("does not exist")) {
      return {
        status: 404,
        body: { message: errorMessage },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to fetch internship applications" },
    };
  }
}

export async function handleGetInternshipApplicationsByCompanyIdAndInternshipId(
  companyId: number,
  internshipId: number,
): Promise<ControllerResult<unknown>> {
  try {
    const applications = await getInternshipApplicationsByCompanyIdAndInternshipId(
      companyId,
      internshipId,
    );
    return { status: 200, body: applications };
  } catch (error) {
    console.error("Error fetching internship applications:", error);

    const errorMessage = (error as Error).message;
    if (
      errorMessage?.includes("does not exist") ||
      errorMessage?.includes("does not belong")
    ) {
      return {
        status: 404,
        body: { message: errorMessage },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to fetch internship applications" },
    };
  }
}

function validateApplicationStatusUpdatePayload(
  payload: unknown,
): ValidationResult {
  if (typeof payload !== "object" || payload === null) {
    return { valid: false, message: "Request body must be an object" };
  }

  const value = payload as Record<string, unknown>;
  const status = value.status;

  if (
    !status ||
    !Object.values(ApplicationStatus).includes(status as ApplicationStatus)
  ) {
    return {
      valid: false,
      message: `Status must be one of: ${Object.values(ApplicationStatus).join(", ")}`,
    };
  }

  return { valid: true };
}

export async function handleUpdateInternshipApplicationStatus(
  studentId: number,
  internshipId: number,
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateApplicationStatusUpdatePayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const value = payload as Record<string, unknown>;
    const status = value.status as ApplicationStatus;

    const application = await updateInternshipApplicationStatus(
      studentId,
      internshipId,
      status,
    );
    return { status: 200, body: application };
  } catch (error) {
    console.error("Error updating internship application status:", error);

    const errorMessage = (error as Error).message;
    if (errorMessage?.includes("does not exist")) {
      return {
        status: 404,
        body: { message: errorMessage },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to update internship application status" },
    };
  }
}
