import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { Role } from "@/generated/prisma/enums";

export type CompanyPayload = {
  name: string;
  email: string;
  password: string;
};

export async function createCompany(payload: CompanyPayload) {
  // Use transaction to ensure atomicity
  return prisma.$transaction(async (tx) => {
    // Hash password before creating User
    const hashedPassword = await hashPassword(payload.password);
    
    // Create User first
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: Role.COMPANY,
      },
    });

    // Create Company with userId (name comes from User)
    return tx.company.create({
      data: {
        userId: user.id,
      },
    });
  });
}
