import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  getStudentsByUniversityAndCollege,
  getStudentsByUniversityCollegeAndDepartment,
  getStudentsByUniversityId,
  StudentPayload,
  StudentUpdatePayload,
  updateStudent,
} from "@/services/studentService";

type ControllerResult<T> = {
  status: number;
  body: T | { message: string };
};

type ValidationResult = {
  valid: boolean;
  message?: string;
};

function validateCreatePayload(payload: unknown): ValidationResult {
  if (typeof payload !== "object" || payload === null) {
    return { valid: false, message: "Request body must be an object" };
  }

  const value = payload as Record<string, unknown>;

  const name = value.name;
  const email = value.email;
  const password = value.password;
  const year = value.year;

  if (typeof name !== "string" || name.trim().length === 0) {
    return { valid: false, message: "Name is required" };
  }

  if (typeof email !== "string" || email.trim().length === 0) {
    return { valid: false, message: "Email is required" };
  }

  if (typeof password !== "string" || password.trim().length === 0) {
    return { valid: false, message: "Password is required" };
  }

  if (typeof year !== "number" || !Number.isInteger(year)) {
    return { valid: false, message: "Year must be an integer" };
  }

  return { valid: true };
}

function validateUpdatePayload(payload: unknown): ValidationResult {
  if (typeof payload !== "object" || payload === null) {
    return { valid: false, message: "Request body must be an object" };
  }

  const value = payload as Record<string, unknown>;

  const allowedKeys = [
    "name",
    "email",
    "password",
    "year",
    "universityId",
    "collegeId",
    "departmentId",
  ];

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
    value.year !== undefined &&
    (typeof value.year !== "number" || !Number.isInteger(value.year as number))
  ) {
    return { valid: false, message: "Year must be an integer" };
  }

  return { valid: true };
}

export async function handleGetAllStudents(
  universityId?: number,
  collegeId?: number,
  departmentId?: number,
): Promise<ControllerResult<unknown>> {
  try {
    let students;

    // Filter by universityId, collegeId, and departmentId
    if (
      universityId !== undefined &&
      collegeId !== undefined &&
      departmentId !== undefined
    ) {
      students = await getStudentsByUniversityCollegeAndDepartment(
        universityId,
        collegeId,
        departmentId,
      );
    }
    // Filter by universityId and collegeId
    else if (universityId !== undefined && collegeId !== undefined) {
      students = await getStudentsByUniversityAndCollege(
        universityId,
        collegeId,
      );
    }
    // Filter by universityId only
    else if (universityId !== undefined) {
      students = await getStudentsByUniversityId(universityId);
    }
    // Get all students
    else {
      students = await getAllStudents();
    }

    return { status: 200, body: students };
  } catch (error) {
    console.error("Error fetching students:", error);
    return {
      status: 500,
      body: { message: "Failed to fetch students" },
    };
  }
}

export async function handleGetStudentById(
  id: number,
): Promise<ControllerResult<unknown>> {
  try {
    const student = await getStudentById(id);

    if (!student) {
      return {
        status: 404,
        body: { message: "Student not found" },
      };
    }

    return { status: 200, body: student };
  } catch (error) {
    return {
      status: 500,
      body: { message: "Failed to fetch student" },
    };
  }
}

export async function handleCreateStudent(
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateCreatePayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const student = await createStudent(payload as StudentPayload);
    return { status: 201, body: student };
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating student:", error);
    
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
    
    // Handle foreign key constraint errors (fallback for any Prisma constraint errors)
    if ((error as { code?: string }).code === "P2003") {
      return {
        status: 400,
        body: { message: "Invalid reference: universityId, collegeId, or departmentId does not exist" },
      };
    }
    
    // Handle specific validation errors for IDs
    const errorMessage = (error as Error).message || "";
    if (errorMessage.includes("does not exist")) {
      return {
        status: 400,
        body: { message: errorMessage },
      };
    }
    
    // Handle transaction timeout errors
    if (errorMessage.includes("transaction") || errorMessage.includes("timeout")) {
      return {
        status: 503,
        body: { 
          message: "Database connection timeout. Please try again in a moment.",
          details: "The database is currently busy. Please retry your request." 
        },
      };
    }
    
    // Return more detailed error message
    return {
      status: 500,
      body: { message: errorMessage || "Failed to create student" },
    };
  }
}

export async function handleUpdateStudent(
  id: number,
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateUpdatePayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const updated = await updateStudent(id, payload as StudentUpdatePayload);
    return { status: 200, body: updated };
  } catch (error) {
    if ((error as { code?: string }).code === "P2025") {
      return {
        status: 404,
        body: { message: "Student not found" },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to update student" },
    };
  }
}

export async function handleDeleteStudent(
  id: number,
): Promise<ControllerResult<unknown>> {
  try {
    const deleted = await deleteStudent(id);
    return { status: 200, body: deleted };
  } catch (error) {
    if ((error as { code?: string }).code === "P2025") {
      return {
        status: 404,
        body: { message: "Student not found" },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to delete student" },
    };
  }
}
