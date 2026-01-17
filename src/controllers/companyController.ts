import {
  CompanyPayload,
  createCompany,
} from "@/services/companyService";

type ControllerResult<T> = {
  status: number;
  body: T | { message: string };
};

type ValidationResult = {
  valid: boolean;
  message?: string;
};

function validateCompanyPayload(payload: unknown): ValidationResult {
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

export async function handleCreateCompany(
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateCompanyPayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const company = await createCompany(payload as CompanyPayload);
    return { status: 201, body: company };
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
      body: { message: "Failed to create company" },
    };
  }
}
