import {
  createTestProject,
  updateTestProjectSubmission,
  getTestProjectsByStudentId,
  CreateTestProjectPayload,
} from "@/services/testProjectService";

type ControllerResult<T> = {
  status: number;
  body: T | { message: string };
};

export async function handleCreateTestProject(
  payload: unknown
): Promise<ControllerResult<unknown>> {
  if (typeof payload !== "object" || payload === null) {
    return { status: 400, body: { message: "Request body must be an object" } };
  }

  const value = payload as Record<string, unknown>;
  const { internshipId, studentId, companyId, description } = value;

  if (
    typeof internshipId !== "number" ||
    typeof studentId !== "number" ||
    typeof companyId !== "number" ||
    typeof description !== "string"
  ) {
    return {
      status: 400,
      body: {
        message:
          "Missing or invalid fields: internshipId, studentId, companyId, description",
      },
    };
  }

  try {
    const testProject = await createTestProject({
      internshipId,
      studentId,
      companyId,
      description,
    });
    return { status: 201, body: testProject };
  } catch (error) {
    console.error("Error creating test project:", error);
    if ((error as { code?: string }).code === "P2002") {
        return { status: 409, body: { message: "Test project already exists for this student and internship" } };
    }
    if ((error as { code?: string }).code === "P2003") {
         return { status: 400, body: { message: "Invalid reference: internshipId, studentId, or companyId does not exist" } };
     }
    return { status: 500, body: { message: "Failed to create test project" } };
  }
}

export async function handleUpdateTestProjectSubmission(
  id: number,
  payload: unknown
): Promise<ControllerResult<unknown>> {
  if (typeof payload !== "object" || payload === null) {
    return { status: 400, body: { message: "Request body must be an object" } };
  }

  const value = payload as Record<string, unknown>;
  const { projectUrl } = value;

  if (typeof projectUrl !== "string") {
    return { status: 400, body: { message: "Invalid or missing projectUrl" } };
  }

  try {
    const updated = await updateTestProjectSubmission(id, projectUrl);
    return { status: 200, body: updated };
  } catch (error) {
    console.error("Error updating test project:", error);
    if ((error as { code?: string }).code === "P2025") {
      return { status: 404, body: { message: "Test project not found" } };
    }
    return { status: 500, body: { message: "Failed to update test project" } };
  }
}

export async function handleGetTestProjectsByStudentId(
  studentId: number
): Promise<ControllerResult<unknown>> {
  try {
    const projects = await getTestProjectsByStudentId(studentId);
    return { status: 200, body: projects };
  } catch (error) {
    console.error("Error fetching test projects:", error);
    return { status: 500, body: { message: "Failed to fetch test projects" } };
  }
}
