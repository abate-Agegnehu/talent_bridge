import prisma from "@/lib/prisma";
import { InternshipStatus, InternshipType } from "@/generated/prisma/enums";

export type InternshipPayload = {
  companyId: number;
  title: string;
  description: string;
  requirements?: string | null;
  responsibilities?: string | null;
  location: string;
  type: InternshipType;
  duration: string;
  stipend?: number | null;
  applicationDeadline: string; // ISO date string
};

export type InternshipApplicationPayload = {
  internshipId: number;
  studentId: number;
};

export async function getAllInternships() {
  return prisma.internship.findMany({
    include: {
      company: {
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
      },
      applications: {
        include: {
          student: {
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
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getInternshipsByCompanyId(companyId: number) {
  return prisma.internship.findMany({
    where: {
      companyId: companyId,
    },
    include: {
      company: {
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
      },
      applications: {
        include: {
          student: {
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
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createInternship(payload: InternshipPayload) {
  // Verify Company exists
  const company = await prisma.company.findUnique({
    where: { id: payload.companyId },
    select: { id: true },
  });

  if (!company) {
    throw new Error(`Company with id ${payload.companyId} does not exist`);
  }

  return prisma.internship.create({
    data: {
      companyId: payload.companyId,
      title: payload.title,
      description: payload.description,
      requirements: payload.requirements ?? null,
      responsibilities: payload.responsibilities ?? null,
      location: payload.location,
      type: payload.type,
      duration: payload.duration,
      stipend: payload.stipend ?? null,
      applicationDeadline: new Date(payload.applicationDeadline),
      status: InternshipStatus.OPEN,
    },
    include: {
      company: {
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
      },
    },
  });
}

export async function createInternshipApplication(
  payload: InternshipApplicationPayload,
) {
  return prisma.$transaction(
    async (tx) => {
      // Verify Internship exists
      const internship = await tx.internship.findUnique({
        where: { id: payload.internshipId },
        select: { id: true, status: true, applicationDeadline: true },
      });

      if (!internship) {
        throw new Error(
          `Internship with id ${payload.internshipId} does not exist`,
        );
      }

      // Check if internship is still open
      if (internship.status !== InternshipStatus.OPEN) {
        throw new Error("This internship is no longer accepting applications");
      }

      // Check if application deadline has passed
      if (new Date() > internship.applicationDeadline) {
        throw new Error("Application deadline has passed");
      }

      // Verify Student exists
      const student = await tx.student.findUnique({
        where: { id: payload.studentId },
        select: { id: true },
      });

      if (!student) {
        throw new Error(`Student with id ${payload.studentId} does not exist`);
      }

      // Check if student has already applied
      const existingApplication = await tx.internshipApplication.findFirst({
        where: {
          internshipId: payload.internshipId,
          studentId: payload.studentId,
        },
      });

      if (existingApplication) {
        throw new Error("You have already applied for this internship");
      }

      // Create application
      return tx.internshipApplication.create({
        data: {
          internshipId: payload.internshipId,
          studentId: payload.studentId,
        },
        include: {
          internship: {
            include: {
              company: {
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
              },
            },
          },
          student: {
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

export async function getInternshipApplicationsByStudentId(studentId: number) {
  // Verify Student exists
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { id: true },
  });

  if (!student) {
    throw new Error(`Student with id ${studentId} does not exist`);
  }

  return prisma.internshipApplication.findMany({
    where: {
      studentId: studentId,
    },
    include: {
      internship: {
        include: {
          company: {
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
          },
        },
      },
      student: {
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
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
  });
}

export async function getInternshipApplicationsByCompanyId(companyId: number) {
  // Verify Company exists
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { id: true },
  });

  if (!company) {
    throw new Error(`Company with id ${companyId} does not exist`);
  }

  return prisma.internshipApplication.findMany({
    where: {
      internship: {
        companyId: companyId,
      },
    },
    include: {
      internship: {
        include: {
          company: {
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
          },
        },
      },
      student: {
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
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
  });
}
