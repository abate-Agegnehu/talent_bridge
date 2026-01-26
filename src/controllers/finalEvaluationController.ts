import {
  createFinalEvaluation,
  CreateFinalEvaluationPayload,
  getFinalEvaluationById,
  getFinalEvaluationsByCompanyId,
  getFinalEvaluationsByStudentId,
} from "@/services/finalEvaluationService";

type ValidationResult = {
  valid: boolean;
  message?: string;
};

type ControllerResult<T> = {
  status: number;
  body: T | { message: string };
};

function validateFinalEvaluationPayload(payload: any): ValidationResult {
  // Check if payload is an object
  if (typeof payload !== "object" || payload === null) {
    return { valid: false, message: "Request body must be an object" };
  }

  // Check required fields
  const requiredFields = [
    "supervisorName",
    "studentId",
    "companyId",
    "punctuality",
    "reliability",
    "independenceInWork",
    "communication",
    "professionalism",
    "speedOfWork",
    "accuracy",
    "engagement",
    "neededForWork",
    "cooperation",
    "technicalSkills",
    "organizationalSkills",
    "projectTaskSupport",
    "responsibility",
    "teamQuality",
  ];

  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null) {
      return { valid: false, message: `Missing required field: ${field}` };
    }
  }

  // Validate IDs are numbers
  if (typeof payload.studentId !== "number" || typeof payload.companyId !== "number") {
      return { valid: false, message: "studentId and companyId must be numbers" };
  }

  // Validate General Performance (Max 5)
  const max5Fields = [
    "punctuality",
    "reliability",
    "independenceInWork",
    "communication",
    "professionalism",
    "speedOfWork",
    "accuracy",
    "engagement",
    "neededForWork",
    "cooperation",
    "technicalSkills",
    "organizationalSkills",
    "projectTaskSupport",
  ];

  for (const field of max5Fields) {
    if (
      typeof payload[field] !== "number" ||
      payload[field] < 0 ||
      payload[field] > 5
    ) {
      return { valid: false, message: `${field} must be between 0 and 5` };
    }
  }

  // Validate Responsibility (Max 15)
  if (
    typeof payload.responsibility !== "number" ||
    payload.responsibility < 0 ||
    payload.responsibility > 15
  ) {
    return {
      valid: false,
      message: "responsibility must be between 0 and 15",
    };
  }

  // Validate Team Quality (Max 20)
  if (
    typeof payload.teamQuality !== "number" ||
    payload.teamQuality < 0 ||
    payload.teamQuality > 20
  ) {
    return {
      valid: false,
      message: "teamQuality must be between 0 and 20",
    };
  }

  return { valid: true };
}

export async function handleCreateFinalEvaluation(
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateFinalEvaluationPayload(payload);
  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message || "Invalid payload" },
    };
  }

  try {
    const result = await createFinalEvaluation(
      payload as CreateFinalEvaluationPayload,
    );
    return { status: 201, body: result };
  } catch (error) {
    console.error("Error creating final evaluation:", error);
    return { status: 500, body: { message: "Internal server error" } };
  }
}

export async function handleGetFinalEvaluationById(
  id: number,
): Promise<ControllerResult<unknown>> {
  try {
    const result = await getFinalEvaluationById(id);
    if (!result) {
      return { status: 404, body: { message: "Final evaluation not found" } };
    }
    return { status: 200, body: result };
  } catch (error) {
    console.error("Error getting final evaluation:", error);
    return { status: 500, body: { message: "Internal server error" } };
  }
}

export async function handleGetFinalEvaluationsByStudentId(
  studentId: number,
): Promise<ControllerResult<unknown>> {
  try {
    const result = await getFinalEvaluationsByStudentId(studentId);
    return { status: 200, body: result };
  } catch (error) {
    console.error("Error getting final evaluations by student ID:", error);
    return { status: 500, body: { message: "Internal server error" } };
  }
}

export async function handleGetFinalEvaluationsByCompanyId(
  companyId: number,
): Promise<ControllerResult<unknown>> {
  try {
    const result = await getFinalEvaluationsByCompanyId(companyId);
    return { status: 200, body: result };
  } catch (error) {
    console.error("Error getting final evaluations by company ID:", error);
    return { status: 500, body: { message: "Internal server error" } };
  }
}
