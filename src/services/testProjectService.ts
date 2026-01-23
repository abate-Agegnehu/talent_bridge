import prisma from "@/lib/prisma";

export type CreateTestProjectPayload = {
  internshipId: number;
  studentId: number;
  companyId: number;
  description: string;
};

export async function createTestProject(data: CreateTestProjectPayload) {
  return prisma.testProject.create({
    data: {
      internshipId: data.internshipId,
      studentId: data.studentId,
      companyId: data.companyId,
      description: data.description,
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

export async function updateTestProjectSubmission(id: number, projectUrl: string) {
  return prisma.testProject.update({
    where: { id },
    data: { projectUrl },
    include: {
        internship: true,
        student: true,
        company: true
    }
  });
}

export async function getTestProjectsByStudentId(studentId: number) {
  return prisma.testProject.findMany({
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
    },
  });
}
