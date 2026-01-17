import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { Role } from "@/generated/prisma/enums";

export type UniversityPayload = {
  name: string;
  email: string;
  password: string;
};

export type CollegePayload = {
  name: string;
  universityId: number;
  email: string;
  password: string;
};

export type DepartmentPayload = {
  name: string;
  collegeId: number;
  email: string;
  password: string;
};

export type AdvisorPayload = {
  name: string;
  departmentId: number;
  email: string;
  password: string;
};

export type AdvisorUpdatePayload = Partial<Omit<AdvisorPayload, "departmentId">> & {
  departmentId?: number;
};

export async function createUniversity(payload: UniversityPayload) {
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
        role: Role.UNIVERSITY,
      },
    });

    // Create University with userId (name comes from User)
    return tx.university.create({
      data: {
        userId: user.id,
      },
    });
  });
}

export async function createCollege(payload: CollegePayload) {
  // Use transaction to ensure atomicity
  return prisma.$transaction(async (tx) => {
    // Verify University exists (select only id to avoid relation issues with NULL userId)
    const university = await tx.university.findUnique({
      where: { id: payload.universityId },
      select: { id: true },
    });

    if (!university) {
      throw new Error(`University with id ${payload.universityId} does not exist`);
    }

    // Hash password before creating User
    const hashedPassword = await hashPassword(payload.password);
    
    // Create User first
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: Role.COLLEGE,
      },
    });

    // Create College with userId (name comes from User)
    return tx.college.create({
      data: {
        universityId: payload.universityId,
        userId: user.id,
      },
    });
  });
}

export async function createDepartment(payload: DepartmentPayload) {
  // Use transaction to ensure atomicity
  return prisma.$transaction(async (tx) => {
    // Verify College exists (select only id to avoid relation issues with NULL userId)
    const college = await tx.college.findUnique({
      where: { id: payload.collegeId },
      select: { id: true },
    });

    if (!college) {
      throw new Error(`College with id ${payload.collegeId} does not exist`);
    }

    // Hash password before creating User
    const hashedPassword = await hashPassword(payload.password);
    
    // Create User first
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: Role.DEPARTMENT,
      },
    });

    // Create Department with userId (name comes from User)
    return tx.department.create({
      data: {
        collegeId: payload.collegeId,
        userId: user.id,
      },
    });
  });
}

export async function getAllAdvisors() {
  return prisma.advisor.findMany({
    include: {
      department: {
        include: {
          college: {
            include: {
              university: true,
            },
          },
        },
      },
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

export async function getAdvisorById(id: number) {
  return prisma.advisor.findUnique({
    where: { id },
    include: {
      department: {
        include: {
          college: {
            include: {
              university: true,
            },
          },
        },
      },
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

export async function createAdvisor(payload: AdvisorPayload) {
  // Use transaction to ensure atomicity
  return prisma.$transaction(async (tx) => {
    // Verify Department exists (select only id to avoid relation issues with NULL userId)
    const department = await tx.department.findUnique({
      where: { id: payload.departmentId },
      select: { id: true },
    });

    if (!department) {
      throw new Error(`Department with id ${payload.departmentId} does not exist`);
    }

    // Hash password before creating User
    const hashedPassword = await hashPassword(payload.password);
    
    // Create User first
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: Role.ADVISOR,
      },
    });

    // Create Advisor with userId (name comes from User)
    return tx.advisor.create({
      data: {
        departmentId: payload.departmentId,
        userId: user.id,
      },
    });
  });
}

export async function updateAdvisor(id: number, payload: AdvisorUpdatePayload) {
  return prisma.$transaction(async (tx) => {
    // Get the advisor to find the userId
    const advisor = await tx.advisor.findUnique({
      where: { id },
      select: { userId: true, departmentId: true },
    });

    if (!advisor) {
      throw new Error("Advisor not found");
    }

    // Verify Department exists if departmentId is being updated
    if (payload.departmentId !== undefined && payload.departmentId !== advisor.departmentId) {
      const department = await tx.department.findUnique({
        where: { id: payload.departmentId },
        select: { id: true },
      });

      if (!department) {
        throw new Error(`Department with id ${payload.departmentId} does not exist`);
      }
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
        where: { id: advisor.userId },
        data: updateData,
      });
    }

    // Update Advisor fields
    return tx.advisor.update({
      where: { id },
      data: {
        ...(payload.departmentId !== undefined && { departmentId: payload.departmentId }),
      },
    });
  });
}

export async function deleteAdvisor(id: number) {
  return prisma.$transaction(async (tx) => {
    // Get the advisor to find the userId
    const advisor = await tx.advisor.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!advisor) {
      throw new Error("Advisor not found");
    }

    // Delete the advisor first
    await tx.advisor.delete({
      where: { id },
    });

    // Delete the associated user
    await tx.user.delete({
      where: { id: advisor.userId },
    });

    return { id, deleted: true };
  });
}
