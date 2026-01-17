import { login, LoginPayload } from "@/services/authService";

type ControllerResult<T> = {
  status: number;
  body: T | { message: string };
};

type ValidationResult = {
  valid: boolean;
  message?: string;
};

function validateLoginPayload(payload: unknown): ValidationResult {
  if (typeof payload !== "object" || payload === null) {
    return { valid: false, message: "Request body must be an object" };
  }

  const value = payload as Record<string, unknown>;
  const email = value.email;
  const password = value.password;

  if (typeof email !== "string" || email.trim().length === 0) {
    return { valid: false, message: "Email is required" };
  }

  if (typeof password !== "string" || password.trim().length === 0) {
    return { valid: false, message: "Password is required" };
  }

  return { valid: true };
}

export async function handleLogin(
  payload: unknown,
): Promise<ControllerResult<unknown>> {
  const validation = validateLoginPayload(payload);

  if (!validation.valid) {
    return {
      status: 400,
      body: { message: validation.message ?? "Invalid request body" },
    };
  }

  try {
    const result = await login(payload as LoginPayload);
    return { status: 200, body: result };
  } catch (error) {
    const errorMessage = (error as Error).message;
    
    if (errorMessage === "Invalid email or password") {
      return {
        status: 401,
        body: { message: "Invalid email or password" },
      };
    }

    return {
      status: 500,
      body: { message: "Failed to login" },
    };
  }
}
