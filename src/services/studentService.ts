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

export async function getStudentsByUniversityId(universityId: number) {
  return prisma.student.findMany({
    where: {
      universityId: universityId,
    },
    include: {
      department: true,
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

export async function getStudentsByUniversityAndCollege(
  universityId: number,
  collegeId: number,
) {
  return prisma.student.findMany({
    where: {
      universityId: universityId,
      collegeId: collegeId,
    },
    include: {
      department: true,
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

export async function getStudentsByUniversityCollegeAndDepartment(
  universityId: number,
  collegeId: number,
  departmentId: number,
) {
  return prisma.student.findMany({
    where: {
      universityId: universityId,
      collegeId: collegeId,
      departmentId: departmentId,
    },
    include: {
      department: true,
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

export async function getStudentById(id: number) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      department: true,
    },
  });
}

export async function createStudent(payload: StudentPayload) {
  // Use transaction to ensure atomicity with timeout
  // Increase timeout for serverless databases like Neon
  return prisma.$transaction(
    async (tx) => {
      // Validate universityId if provided
      if (payload.universityId !== undefined && payload.universityId !== null) {
        const university = await tx.university.findUnique({
          where: { id: payload.universityId },
          select: { id: true },
        });
        if (!university) {
          throw new Error(`University with id ${payload.universityId} does not exist`);
        }
      }

      // Validate collegeId if provided
      if (payload.collegeId !== undefined && payload.collegeId !== null) {
        const college = await tx.college.findUnique({
          where: { id: payload.collegeId },
          select: { id: true, universityId: true },
        });
        if (!college) {
          throw new Error(`College with id ${payload.collegeId} does not exist`);
        }
        // Validate that college belongs to the specified university if universityId is also provided
        if (
          payload.universityId !== undefined &&
          payload.universityId !== null &&
          college.universityId !== payload.universityId
        ) {
          throw new Error(
            `College with id ${payload.collegeId} does not belong to University with id ${payload.universityId}`,
          );
        }
      }

      // Validate departmentId if provided
      if (payload.departmentId !== undefined && payload.departmentId !== null) {
        const department = await tx.department.findUnique({
          where: { id: payload.departmentId },
          select: { id: true, collegeId: true },
        });
        if (!department) {
          throw new Error(`Department with id ${payload.departmentId} does not exist`);
        }
        // Validate that department belongs to the specified college if collegeId is also provided
        if (
          payload.collegeId !== undefined &&
          payload.collegeId !== null &&
          department.collegeId !== payload.collegeId
        ) {
          throw new Error(
            `Department with id ${payload.departmentId} does not belong to College with id ${payload.collegeId}`,
          );
        }
      }

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
    },
    {
      maxWait: 10000, // Maximum time to wait for a transaction slot (10 seconds)
      timeout: 20000, // Maximum time the transaction can run (20 seconds)
    },
  );
}

export async function updateStudent(id: number, payload: StudentUpdatePayload) {
  return prisma.$transaction(
    async (tx) => {
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
  },
    {
      maxWait: 10000,
      timeout: 20000,
    },
  );
}

export async function deleteStudent(id: number) {
  return prisma.student.delete({
    where: { id },
  });
}
