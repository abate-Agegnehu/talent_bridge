import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { Role } from "@/generated/prisma/enums";

export type CompanyPayload = {
  name: string;
  email: string;
  password: string;
};

export type CompanyUpdatePayload = Partial<Omit<CompanyPayload, "password">> & {
  password?: string;
};

export async function getAllCompanies() {
  return prisma.company.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getCompanyById(id: number) {
  return prisma.company.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

export async function createCompany(payload: CompanyPayload) {
  // Use transaction to ensure atomicity with timeout
  return prisma.$transaction(
    async (tx) => {
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

export async function updateCompany(id: number, payload: CompanyUpdatePayload) {
  return prisma.$transaction(
    async (tx) => {
    // Get the company to find the userId
    const company = await tx.company.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    // Update User if name/email/password are provided
    if (payload.name || payload.email || payload.password) {
      const updateData: {
        name?: string;
        email?: string;
        password?: string;
      } = {};
      
      if (payload.name) updateData.name = payload.name;
      if (payload.email) updateData.email = payload.email;
      if (payload.password) {
        // Hash password if it's being updated
        updateData.password = await hashPassword(payload.password);
      }
      
      await tx.user.update({
        where: { id: company.userId },
        data: updateData,
      });
    }

    // Company has no additional fields to update (only userId)
    return tx.company.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  },
    {
      maxWait: 10000,
      timeout: 20000,
    },
  );
}

export async function deleteCompany(id: number) {
  return prisma.$transaction(
    async (tx) => {
    // Get the company to find the userId
    const company = await tx.company.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    // Delete the company first
    await tx.company.delete({
      where: { id },
    });

    // Delete the associated user
    await tx.user.delete({
      where: { id: company.userId },
    });

    return { id, deleted: true };
  },
    {
      maxWait: 10000,
      timeout: 20000,
    },
  );
}
