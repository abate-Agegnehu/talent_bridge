import {
  AdvisorPayload,
  AdvisorUpdatePayload,
  CollegePayload,
  createAdvisor,
  createCollege,
  createDepartment,
  createUniversity,
  deleteAdvisor,
  DepartmentPayload,
  getAllAdvisors,
  getAdvisorById,
  updateAdvisor,
  UniversityPayload,
} from "@/services/institutionService";

type ControllerResult<T> = {
  status: number;
  body: T | { message: string };
};

type ValidationResult = {
  valid: boolean;
  message?: string;
};

function validateNameOnlyPayload(payload: unknown): ValidationResult {
  if (typeof payload !== "object" || payload === null) {
    return { valid: false, message: "Request body must be an object" };
  }

  const value = payload as Record<string, unknown>;
  const name = value.name;
  const email = value.email;
  const password = value.password;

  if (typeof name !== "string" || name.trim().length === 0) {
    return { valid: false, message: "Name is required" };
  }

  if (typeof email !== "string" || email.trim().length === 0) {
    return { valid: false, message: "Email is required" };
  }

  if (typeof password !== "string" || password.trim().length === 0) {
    return { valid: false, message: "Password is required" };
  }

  return { valid: true };
}

function validateCollegePayload(payload: unknown): ValidationResult {
  const base = validateNameOnlyPayload(payload);

  if (!base.valid) {
    return base;
  }

  const value = payload as Record<string, unknown>;
  const universityId = value.universityId;

  if (
    typeof universityId !== "number" ||
    !Number.isInteger(universityId) ||
    universityId <= 0
  ) {
    return { valid: false, message: "universityId must be a positive integer" };
  }

  return { valid: true };
}

function validateDepartmentPayload(payload: unknown): ValidationResult {
  const base = validateNameOnlyPayload(payload);

  if (!base.valid) {
    return base;
  }

  const value = payload as Record<string, unknown>;
  const collegeId = value.collegeId;

  if (
    typeof collegeId !== "number" ||
    !Number.isInteger(collegeId) ||
    collegeId <= 0
  ) {
    return { valid: false, message: "collegeId must be a positive integer" };
  }

  return { valid: true };
}

function validateAdvisorPayload(payload: unknown): ValidationResult {
  const base = validateNameOnlyPayload(payload);

  if (!base.valid) {
    return base;
  }

  const value = payload as Record<string, unknown>;
  const departmentId = value.departmentId;

  if (
    typeof departmentId !== "number" ||
    !Number.isInteger(departmentId) ||
    departmentId <= 0
  ) {
    return { valid: false, message: "departmentId must be a positive integer" };
  }

  return { valid: true };
}

export async function handleCreateUniversity(
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateNameOnlyPayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const university = await createUniversity(payload as UniversityPayload);
    return { status: 201, body: university };
  } catch (error) {
    if ((error as { code?: string; meta?: { target?: string[] } }).code === "P2002") {
      const target = (error as { meta?: { target?: string[] } }).meta?.target;
      if (Array.isArray(target) && target.includes("email")) {
        return {
          status: 409,
          body: { message: "Email already exists" },
        };
      }
      return {
        status: 409,
        body: { message: "Unique constraint violation" },
      };
    }
    return {
      status: 500,
      body: { message: "Failed to create university" },
    };
  }
}

export async function handleCreateCollege(
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateCollegePayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const college = await createCollege(payload as CollegePayload);
    return { status: 201, body: college };
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating college:", error);
    
    if ((error as { code?: string; meta?: { target?: string[] } }).code === "P2002") {
      const target = (error as { meta?: { target?: string[] } }).meta?.target;
      if (Array.isArray(target) && target.includes("email")) {
        return {
          status: 409,
          body: { message: "Email already exists" },
        };
      }
      return {
        status: 409,
        body: { message: "Unique constraint violation" },
      };
    }
    if ((error as { code?: string }).code === "P2003") {
      return {
        status: 400,
        body: { message: "Invalid universityId - University does not exist" },
      };
    }

    // Return more detailed error message
    const errorMessage = (error as Error).message || "Failed to create college";
    return {
      status: 500,
      body: { message: errorMessage },
    };
  }
}

export async function handleCreateDepartment(
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateDepartmentPayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const department = await createDepartment(payload as DepartmentPayload);
    return { status: 201, body: department };
  } catch (error) {
    if ((error as { code?: string; meta?: { target?: string[] } }).code === "P2002") {
      const target = (error as { meta?: { target?: string[] } }).meta?.target;
      if (Array.isArray(target) && target.includes("email")) {
        return {
          status: 409,
          body: { message: "Email already exists" },
        };
      }
      return {
        status: 409,
        body: { message: "Unique constraint violation" },
      };
    }
    if ((error as { code?: string }).code === "P2003") {
      return {
        status: 400,
        body: { message: "Invalid collegeId" },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to create department" },
    };
  }
}

export async function handleGetAllAdvisors(): Promise<
  ControllerResult<unknown>
> {
  try {
    const advisors = await getAllAdvisors();
    return { status: 200, body: advisors };
  } catch (error) {
    console.error("Error fetching advisors:", error);
    return {
      status: 500,
      body: { message: "Failed to fetch advisors" },
    };
  }
}

export async function handleGetAdvisorById(
  id: number,
): Promise<ControllerResult<unknown>> {
  try {
    const advisor = await getAdvisorById(id);

    if (!advisor) {
      return {
        status: 404,
        body: { message: "Advisor not found" },
      };
    }

    return { status: 200, body: advisor };
  } catch (error) {
    console.error("Error fetching advisor:", error);
    return {
      status: 500,
      body: { message: "Failed to fetch advisor" },
    };
  }
}

export async function handleCreateAdvisor(
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateAdvisorPayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const advisor = await createAdvisor(payload as AdvisorPayload);
    return { status: 201, body: advisor };
  } catch (error) {
    console.error("Error creating advisor:", error);
    
    if ((error as { code?: string; meta?: { target?: string[] } }).code === "P2002") {
      const target = (error as { meta?: { target?: string[] } }).meta?.target;
      if (Array.isArray(target) && target.includes("email")) {
        return {
          status: 409,
          body: { message: "Email already exists" },
        };
      }
      return {
        status: 409,
        body: { message: "Unique constraint violation" },
      };
    }
    if ((error as { code?: string }).code === "P2003") {
      return {
        status: 400,
        body: { message: "Invalid departmentId" },
      };
    }

    const errorMessage = (error as Error).message || "Failed to create advisor";
    return {
      status: 500,
      body: { message: errorMessage },
    };
  }
}

function validateAdvisorUpdatePayload(payload: unknown): ValidationResult {
  if (typeof payload !== "object" || payload === null) {
    return { valid: false, message: "Request body must be an object" };
  }

  const value = payload as Record<string, unknown>;
  const allowedKeys = ["name", "email", "password", "departmentId"];

  const keys = Object.keys(value);

  if (keys.length === 0) {
    return { valid: false, message: "At least one field must be provided" };
  }

  for (const key of keys) {
    if (!allowedKeys.includes(key)) {
      return { valid: false, message: `Unknown field: ${key}` };
    }
  }

  if (
    value.departmentId !== undefined &&
    (typeof value.departmentId !== "number" ||
      !Number.isInteger(value.departmentId) ||
      value.departmentId <= 0)
  ) {
    return { valid: false, message: "departmentId must be a positive integer" };
  }

  if (
    value.name !== undefined &&
    (typeof value.name !== "string" || value.name.trim().length === 0)
  ) {
    return { valid: false, message: "Name must be a non-empty string" };
  }

  if (
    value.email !== undefined &&
    (typeof value.email !== "string" || value.email.trim().length === 0)
  ) {
    return { valid: false, message: "Email must be a non-empty string" };
  }

  if (
    value.password !== undefined &&
    (typeof value.password !== "string" || value.password.trim().length === 0)
  ) {
    return { valid: false, message: "Password must be a non-empty string" };
  }

  return { valid: true };
}

export async function handleUpdateAdvisor(
  id: number,
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateAdvisorUpdatePayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const updated = await updateAdvisor(id, payload as AdvisorUpdatePayload);
    return { status: 200, body: updated };
  } catch (error) {
    console.error("Error updating advisor:", error);
    
    if ((error as Error).message === "Advisor not found") {
      return {
        status: 404,
        body: { message: "Advisor not found" },
      };
    }

    if ((error as { code?: string; meta?: { target?: string[] } }).code === "P2002") {
      const target = (error as { meta?: { target?: string[] } }).meta?.target;
      if (Array.isArray(target) && target.includes("email")) {
        return {
          status: 409,
          body: { message: "Email already exists" },
        };
      }
      return {
        status: 409,
        body: { message: "Unique constraint violation" },
      };
    }

    const errorMessage = (error as Error).message || "Failed to update advisor";
    return {
      status: 500,
      body: { message: errorMessage },
    };
  }
}

export async function handleDeleteAdvisor(
  id: number,
): Promise<ControllerResult<unknown>> {
  try {
    const deleted = await deleteAdvisor(id);
    return { status: 200, body: deleted };
  } catch (error) {
    console.error("Error deleting advisor:", error);
    
    if ((error as Error).message === "Advisor not found") {
      return {
        status: 404,
        body: { message: "Advisor not found" },
      };
    }

    if ((error as { code?: string }).code === "P2025") {
      return {
        status: 404,
        body: { message: "Advisor not found" },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to delete advisor" },
    };
  }
}
