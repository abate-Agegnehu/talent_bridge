import prisma from "@/lib/prisma";

export type CreateInternshipAcceptancePayload = {
  internshipId: number;
  studentId: number;
  companyId: number;
  letter: string;
};

export async function createInternshipAcceptance(data: CreateInternshipAcceptancePayload) {
  // Verify that the internship, student and company exist is handled by foreign key constraints,
  // but we might want to check if the student has already accepted another internship if business logic requires.
  // The schema has @@unique([internshipId, studentId]), so duplicate acceptance for same internship is prevented.
  
  return prisma.internshipAcceptance.create({
    data: {
      internshipId: data.internshipId,
      studentId: data.studentId,
      companyId: data.companyId,
      letter: data.letter,
    },
    include: {
      internship: true,
      student: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      },
      company: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      }
    }
  });
}

export async function updateInternshipAcceptanceDepartment(id: number, departmentId: number) {
  return prisma.internshipAcceptance.update({
    where: { id },
    data: { departmentId },
    include: {
        department: true
    }
  });
}

export async function getInternshipAcceptancesByStudentId(studentId: number) {
  return prisma.internshipAcceptance.findMany({
    where: { studentId },
    include: {
      internship: true,
      company: {
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
      },
      department: true,
    },
  });
}
