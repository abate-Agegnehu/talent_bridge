import {
  createTestProject,
  getTestProjectsByCompanyId,
  getTestProjectsByStudentId,
  updateTestProject,
  UpdateTestProjectPayload,
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
  const { internshipId, studentId, companyId, description, projectUrl } = value;

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
  
  if (projectUrl !== undefined && typeof projectUrl !== "string") {
      return {
          status: 400,
          body: {
              message: "Invalid field: projectUrl must be a string"
          }
      }
  }

  try {
    const testProject = await createTestProject({
      internshipId,
      studentId,
      companyId,
      description,
      projectUrl: projectUrl as string | undefined,
    });
    return { status: 201, body: testProject };
  } catch (error) {
    console.error("Error creating test project:", error);
    
    const message = (error as Error).message;

    if (message === "Internship not found" || message === "Student not found" || message === "Company not found") {
        return { status: 404, body: { message } };
    }

    if (message === "Test project already exists for this student and internship") {
        return { status: 409, body: { message } };
    }

    if ((error as { code?: string }).code === "P2002") {
        return { status: 409, body: { message: "Test project already exists" } };
    }
    if ((error as { code?: string }).code === "P2003") {
        return { status: 400, body: { message: "Invalid reference ID" } };
    }

    return { status: 500, body: { message: "Failed to create test project" } };
  }
}

export async function handleUpdateTestProject(
  id: number,
  payload: unknown
): Promise<ControllerResult<unknown>> {
  if (typeof payload !== "object" || payload === null) {
    return { status: 400, body: { message: "Request body must be an object" } };
  }

  const value = payload as Record<string, unknown>;
  const { description, projectUrl } = value;

  if (description !== undefined && typeof description !== "string") {
    return { status: 400, body: { message: "Invalid field: description must be a string" } };
  }

  if (projectUrl !== undefined && typeof projectUrl !== "string") {
    return { status: 400, body: { message: "Invalid field: projectUrl must be a string" } };
  }

  try {
    const updated = await updateTestProject(id, {
      description: description as string | undefined,
      projectUrl: projectUrl as string | undefined,
    });
    return { status: 200, body: updated };
  } catch (error) {
    console.error("Error updating test project:", error);
    
    if ((error as Error).message === "Test project not found") {
      return { status: 404, body: { message: "Test project not found" } };
    }
    
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
    const testProjects = await getTestProjectsByStudentId(studentId);
    return { status: 200, body: testProjects };
  } catch (error) {
    console.error("Error fetching test projects:", error);
    return { status: 500, body: { message: "Failed to fetch test projects" } };
  }
}

export async function handleGetTestProjectsByCompanyId(
    companyId: number
  ): Promise<ControllerResult<unknown>> {
    try {
      const testProjects = await getTestProjectsByCompanyId(companyId);
      return { status: 200, body: testProjects };
    } catch (error) {
      console.error("Error fetching test projects:", error);
      return { status: 500, body: { message: "Failed to fetch test projects" } };
    }
  }
