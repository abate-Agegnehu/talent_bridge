import {
  CompanyPayload,
  CompanyUpdatePayload,
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  updateCompanyStatus,
} from "@/services/companyService";
import { RegistrationStatus } from "@/generated/prisma/enums";

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

export async function handleGetAllCompanies(): Promise<
  ControllerResult<unknown>
> {
  try {
    const companies = await getAllCompanies();
    return { status: 200, body: companies };
  } catch (error) {
    console.error("Error fetching companies:", error);
    return {
      status: 500,
      body: { message: "Failed to fetch companies" },
    };
  }
}

export async function handleGetCompanyById(
  id: number,
): Promise<ControllerResult<unknown>> {
  try {
    const company = await getCompanyById(id);

    if (!company) {
      return {
        status: 404,
        body: { message: "Company not found" },
      };
    }

    return { status: 200, body: company };
  } catch (error) {
    console.error("Error fetching company:", error);
    return {
      status: 500,
      body: { message: "Failed to fetch company" },
    };
  }
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
    console.error("Error creating company:", error);
    
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

    const errorMessage = (error as Error).message || "Failed to create company";
    return {
      status: 500,
      body: { message: errorMessage },
    };
  }
}

function validateCompanyUpdatePayload(payload: unknown): ValidationResult {
  if (typeof payload !== "object" || payload === null) {
    return { valid: false, message: "Request body must be an object" };
  }

  const value = payload as Record<string, unknown>;
  const allowedKeys = ["name", "email", "password"];

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

export async function handleUpdateCompany(
  id: number,
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateCompanyUpdatePayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const updated = await updateCompany(id, payload as CompanyUpdatePayload);
    return { status: 200, body: updated };
  } catch (error) {
    console.error("Error updating company:", error);
    
    if ((error as Error).message === "Company not found") {
      return {
        status: 404,
        body: { message: "Company not found" },
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

    const errorMessage = (error as Error).message || "Failed to update company";
    return {
      status: 500,
      body: { message: errorMessage },
    };
  }
}

export async function handleDeleteCompany(
  id: number,
): Promise<ControllerResult<unknown>> {
  try {
    const deleted = await deleteCompany(id);
    return { status: 200, body: deleted };
  } catch (error) {
    console.error("Error deleting company:", error);
    
    if ((error as Error).message === "Company not found") {
      return {
        status: 404,
        body: { message: "Company not found" },
      };
    }

    if ((error as { code?: string }).code === "P2025") {
      return {
        status: 404,
        body: { message: "Company not found" },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to delete company" },
    };
  }
}

export async function handleUpdateCompanyStatus(
  id: number,
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  try {
    if (typeof payload !== "object" || payload === null) {
      return { status: 400, body: { message: "Request body must be an object" } };
    }

    const value = payload as Record<string, unknown>;
    const status = value.status;

    // Check if RegistrationStatus is defined
    if (!RegistrationStatus) {
      throw new Error("RegistrationStatus enum is not defined");
    }

    if (
      !status ||
      !Object.values(RegistrationStatus).includes(status as RegistrationStatus)
    ) {
      return {
        status: 400,
        body: {
          message: `Status must be one of: ${Object.values(RegistrationStatus).join(", ")}`,
        },
      };
    }

    const updated = await updateCompanyStatus(id, status as RegistrationStatus);
    return { status: 200, body: updated };
  } catch (error) {
    console.error("Error updating company status:", error);
    if ((error as { code?: string }).code === "P2025") {
      return { status: 404, body: { message: "Company not found" } };
    }
    return { 
      status: 500, 
      body: { 
        message: "Failed to update company status",
        error: error instanceof Error ? error.message : String(error)
      } 
    };
  }
}
