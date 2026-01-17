import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResult = {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

export async function login(payload: LoginPayload): Promise<LoginResult> {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await verifyPassword(payload.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Return user data (without password)
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
