import prisma from "@/lib/prisma";

export type CreateTestProjectPayload = {
  internshipId: number;
  studentId: number;
  companyId: number;
  description: string;
  projectUrl?: string;
};

export async function createTestProject(payload: CreateTestProjectPayload) {
  // Check if internship exists
  const internship = await prisma.internship.findUnique({
    where: { id: payload.internshipId },
  });

  if (!internship) {
    throw new Error("Internship not found");
  }

  // Check if student exists
  const student = await prisma.student.findUnique({
    where: { id: payload.studentId },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  // Check if company exists
  const company = await prisma.company.findUnique({
    where: { id: payload.companyId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Check if test project already exists for this student and internship
  const existingTestProject = await prisma.testProject.findUnique({
    where: {
      internshipId_studentId: {
        internshipId: payload.internshipId,
        studentId: payload.studentId,
      },
    },
  });

  if (existingTestProject) {
    throw new Error("Test project already exists for this student and internship");
  }

  return prisma.testProject.create({
    data: {
      internshipId: payload.internshipId,
      studentId: payload.studentId,
      companyId: payload.companyId,
      description: payload.description,
      projectUrl: payload.projectUrl,
    },
    include: {
      internship: true,
      student: {
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
      },
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

export type UpdateTestProjectPayload = {
  description?: string;
  projectUrl?: string;
};

export async function updateTestProject(id: number, payload: UpdateTestProjectPayload) {
  // Check if test project exists
  const testProject = await prisma.testProject.findUnique({
    where: { id },
  });

  if (!testProject) {
    throw new Error("Test project not found");
  }

  return prisma.testProject.update({
    where: { id },
    data: {
      ...(payload.description && { description: payload.description }),
      ...(payload.projectUrl && { projectUrl: payload.projectUrl }),
    },
    include: {
      internship: true,
      student: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      company: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
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

export async function getTestProjectsByCompanyId(companyId: number) {
    return prisma.testProject.findMany({
      where: { companyId },
      include: {
        internship: true,
        student: {
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
