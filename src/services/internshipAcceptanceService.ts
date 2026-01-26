import prisma from "@/lib/prisma";

export type CreateInternshipAcceptancePayload = {
  internshipId: number;
  studentId: number;
  companyId: number;
  letter: string;
};

export async function createInternshipAcceptance(
  payload: CreateInternshipAcceptancePayload
) {
  return prisma.internshipAcceptance.create({
    data: {
      internshipId: payload.internshipId,
      studentId: payload.studentId,
      companyId: payload.companyId,
      letter: payload.letter,
    },
    include: {
      internship: true,
      student: true,
      company: true,
    },
  });
}

export async function updateInternshipAcceptanceDepartment(
  id: number,
  departmentId: number
) {
  return prisma.internshipAcceptance.update({
    where: { id },
    data: {
      departmentId,
    },
    include: {
      department: true,
    },
  });
}

export async function getInternshipAcceptancesByStudentId(studentId: number) {
  return prisma.internshipAcceptance.findMany({
    where: {
      studentId,
    },
    include: {
      internship: {
        include: {
          company: true,
        },
      },
      company: true,
      department: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
