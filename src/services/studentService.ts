import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { Role } from "@/generated/prisma/enums";

export type StudentPayload = {
  name: string;
  email: string;
  password: string;
  year: number;
  universityId?: number | null;
  collegeId?: number | null;
  departmentId?: number | null;
};

export type StudentUpdatePayload = Partial<StudentPayload>;

export async function getAllStudents() {
  return prisma.student.findMany({
    include: {
      department: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getStudentById(id: number) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      department: true,
    },
  });
}

export async function createStudent(payload: StudentPayload) {
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
        role: Role.STUDENT,
      },
    });

    // Create Student with userId
    // Note: name, email, password are now only in User model, not Student
    return tx.student.create({
      data: {
        year: payload.year,
        universityId: payload.universityId ?? null,
        collegeId: payload.collegeId ?? null,
        departmentId: payload.departmentId ?? null,
        userId: user.id,
      },
    });
  });
}

export async function updateStudent(id: number, payload: StudentUpdatePayload) {
  return prisma.$transaction(async (tx) => {
    // Get the student to find the userId
    const student = await tx.student.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!student) {
      throw new Error("Student not found");
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
        where: { id: student.userId },
        data: updateData,
      });
    }

    // Update Student fields (name, email, password are only in User, not Student)
    return tx.student.update({
      where: { id },
      data: {
        ...(payload.year !== undefined && { year: payload.year }),
        ...(payload.universityId !== undefined && { universityId: payload.universityId }),
        ...(payload.collegeId !== undefined && { collegeId: payload.collegeId }),
        ...(payload.departmentId !== undefined && { departmentId: payload.departmentId }),
      },
    });
  });
}

export async function deleteStudent(id: number) {
  return prisma.student.delete({
    where: { id },
  });
}
