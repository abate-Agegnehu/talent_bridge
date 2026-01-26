import {
  createWeeklyReport,
  CreateWeeklyReportPayload,
  getWeeklyReportsByStudentId,
  getWeeklyReportsByCompanyId,
} from "@/services/weeklyReportService";

type ValidationResult = {
  valid: boolean;
  message?: string;
};

type ControllerResult<T> = {
  status: number;
  body: T | { message: string };
};

function validateWeeklyReportPayload(payload: any): ValidationResult {
  // Check if payload is an object
  if (typeof payload !== "object" || payload === null) {
    return { valid: false, message: "Request body must be an object" };
  }

  // Check required fields
  const requiredFields = ["companyId", "studentId", "weekNumber", "activity"];

  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null) {
      return { valid: false, message: `Missing required field: ${field}` };
    }
  }

  // Validate IDs are numbers
  if (typeof payload.studentId !== "number" || typeof payload.companyId !== "number") {
    return { valid: false, message: "studentId and companyId must be numbers" };
  }

  // Validate weekNumber is a positive number
  if (typeof payload.weekNumber !== "number" || payload.weekNumber < 1) {
    return { valid: false, message: "weekNumber must be a positive number" };
  }

  // Validate activity is a non-empty string
  if (typeof payload.activity !== "string" || payload.activity.trim().length === 0) {
    return { valid: false, message: "activity must be a non-empty string" };
  }

  return { valid: true };
}

export async function handleCreateWeeklyReport(
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateWeeklyReportPayload(payload);
  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message || "Invalid payload" },
    };
  }

  try {
    const result = await createWeeklyReport(
      payload as CreateWeeklyReportPayload,
    );
    return { status: 201, body: result };
  } catch (error) {
    console.error("Error creating weekly report:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return { status: 500, body: { message: errorMessage } };
  }
}

export async function handleGetWeeklyReportsByStudentId(
  studentId: number,
): Promise<ControllerResult<unknown>> {
  try {
    const result = await getWeeklyReportsByStudentId(studentId);
    return { status: 200, body: result };
  } catch (error) {
    console.error("Error getting weekly reports by student ID:", error);
    return { status: 500, body: { message: "Internal server error" } };
  }
}

export async function handleGetWeeklyReportsByCompanyId(
  companyId: number,
): Promise<ControllerResult<unknown>> {
  try {
    const result = await getWeeklyReportsByCompanyId(companyId);
    return { status: 200, body: result };
  } catch (error) {
    console.error("Error getting weekly reports by company ID:", error);
    return { status: 500, body: { message: "Internal server error" } };
  }
}
