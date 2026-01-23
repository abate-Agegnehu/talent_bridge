import {
  createInternshipAcceptance,
  updateInternshipAcceptanceDepartment,
  getInternshipAcceptancesByStudentId,
  CreateInternshipAcceptancePayload,
} from "@/services/internshipAcceptanceService";

type ControllerResult<T> = {
  status: number;
  body: T | { message: string };
};

export async function handleCreateInternshipAcceptance(
  payload: unknown
): Promise<ControllerResult<unknown>> {
  if (typeof payload !== "object" || payload === null) {
    return { status: 400, body: { message: "Request body must be an object" } };
  }

  const value = payload as Record<string, unknown>;
  const { internshipId, studentId, companyId, letter } = value;

  if (
    typeof internshipId !== "number" ||
    typeof studentId !== "number" ||
    typeof companyId !== "number" ||
    typeof letter !== "string"
  ) {
    return {
      status: 400,
      body: {
        message:
          "Missing or invalid fields: internshipId, studentId, companyId, letter",
      },
    };
  }

  try {
    const acceptance = await createInternshipAcceptance({
      internshipId,
      studentId,
      companyId,
      letter,
    });
    return { status: 201, body: acceptance };
  } catch (error) {
    console.error("Error creating internship acceptance:", error);
    // Handle unique constraint violation
    if ((error as { code?: string }).code === "P2002") {
        return { status: 409, body: { message: "Acceptance already exists for this student and internship" } };
    }
    if ((error as { code?: string }).code === "P2003") {
        return { status: 400, body: { message: "Invalid reference: internshipId, studentId, or companyId does not exist" } };
    }
    return { status: 500, body: { message: "Failed to create internship acceptance" } };
  }
}

export async function handleUpdateInternshipAcceptanceDepartment(
  id: number,
  payload: unknown
): Promise<ControllerResult<unknown>> {
  if (typeof payload !== "object" || payload === null) {
    return { status: 400, body: { message: "Request body must be an object" } };
  }

  const value = payload as Record<string, unknown>;
  const { departmentId } = value;

  if (typeof departmentId !== "number") {
    return { status: 400, body: { message: "Invalid or missing departmentId" } };
  }

  try {
    const updated = await updateInternshipAcceptanceDepartment(id, departmentId);
    return { status: 200, body: updated };
  } catch (error) {
    console.error("Error updating internship acceptance:", error);
    if ((error as { code?: string }).code === "P2025") {
      return { status: 404, body: { message: "Internship acceptance not found" } };
    }
    return { status: 500, body: { message: "Failed to update internship acceptance" } };
  }
}

export async function handleGetInternshipAcceptanceByStudentId(
  studentId: number
): Promise<ControllerResult<unknown>> {
  try {
    const acceptances = await getInternshipAcceptancesByStudentId(studentId);
    return { status: 200, body: acceptances };
  } catch (error) {
    console.error("Error fetching internship acceptances:", error);
    return { status: 500, body: { message: "Failed to fetch internship acceptances" } };
  }
}
