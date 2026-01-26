import prisma from "@/lib/prisma";

export type CreateFinalEvaluationPayload = {
  supervisorName: string;
  studentId: number;
  companyId: number;
  punctuality: number;
  reliability: number;
  independenceInWork: number;
  communication: number;
  professionalism: number;
  speedOfWork: number;
  accuracy: number;
  engagement: number;
  neededForWork: number;
  cooperation: number;
  technicalSkills: number;
  organizationalSkills: number;
  projectTaskSupport: number;
  responsibility: number;
  teamQuality: number;
  totalPercentage: number;
  supervisorSignature?: string | null;
};

export type UpdateFinalEvaluationPayload = {
  supervisorName?: string;
  punctuality?: number;
  reliability?: number;
  independenceInWork?: number;
  communication?: number;
  professionalism?: number;
  speedOfWork?: number;
  accuracy?: number;
  engagement?: number;
  neededForWork?: number;
  cooperation?: number;
  technicalSkills?: number;
  organizationalSkills?: number;
  projectTaskSupport?: number;
  responsibility?: number;
  teamQuality?: number;
  totalPercentage?: number;
  supervisorSignature?: string | null;
};

export async function createFinalEvaluation(
  payload: CreateFinalEvaluationPayload,
) {
  const {
    supervisorName,
    studentId,
    companyId,
    punctuality,
    reliability,
    independenceInWork,
    communication,
    professionalism,
    speedOfWork,
    accuracy,
    engagement,
    neededForWork,
    cooperation,
    technicalSkills,
    organizationalSkills,
    projectTaskSupport,
    responsibility,
    teamQuality,
    totalPercentage,
    supervisorSignature,
  } = payload;

  // Check if company exists
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new Error(`Company with ID ${companyId} not found`);
  }

  // Check if student exists
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new Error(`Student with ID ${studentId} not found`);
  }

  // Check if evaluation already exists (unique constraint on [companyId, studentId])
  const existingEvaluation = await prisma.finalEvaluation.findFirst({
    where: {
      companyId,
      studentId,
    },
  });

  const evaluationData = {
    supervisorName,
    punctuality,
    reliability,
    independenceInWork,
    communication,
    professionalism,
    speedOfWork,
    accuracy,
    engagement,
    neededForWork,
    cooperation,
    technicalSkills,
    organizationalSkills,
    projectTaskSupport,
    responsibility,
    teamQuality,
    totalPercentage,
    supervisorSignature: supervisorSignature ?? null,
  };

  const includeOptions = {
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
  };

  if (existingEvaluation) {
    // Update existing evaluation
    return prisma.finalEvaluation.update({
      where: { id: existingEvaluation.id },
      data: evaluationData,
      include: includeOptions,
    });
  } else {
    // Create new evaluation
    return prisma.finalEvaluation.create({
      data: {
        ...evaluationData,
        studentId,
        companyId,
      },
      include: includeOptions,
    });
  }
}

export async function updateFinalEvaluation(
  companyId: number,
  studentId: number,
  payload: UpdateFinalEvaluationPayload,
) {
  // Check if company exists
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new Error(`Company with ID ${companyId} not found`);
  }

  // Check if student exists
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new Error(`Student with ID ${studentId} not found`);
  }

  // Check if evaluation exists
  const existingEvaluation = await prisma.finalEvaluation.findFirst({
    where: {
      companyId,
      studentId,
    },
  });

  if (!existingEvaluation) {
    throw new Error(
      `Final evaluation not found for company ${companyId} and student ${studentId}`,
    );
  }

  return prisma.finalEvaluation.update({
    where: { id: existingEvaluation.id },
    data: {
      ...(payload.supervisorName !== undefined && {
        supervisorName: payload.supervisorName,
      }),
      ...(payload.punctuality !== undefined && {
        punctuality: payload.punctuality,
      }),
      ...(payload.reliability !== undefined && {
        reliability: payload.reliability,
      }),
      ...(payload.independenceInWork !== undefined && {
        independenceInWork: payload.independenceInWork,
      }),
      ...(payload.communication !== undefined && {
        communication: payload.communication,
      }),
      ...(payload.professionalism !== undefined && {
        professionalism: payload.professionalism,
      }),
      ...(payload.speedOfWork !== undefined && {
        speedOfWork: payload.speedOfWork,
      }),
      ...(payload.accuracy !== undefined && { accuracy: payload.accuracy }),
      ...(payload.engagement !== undefined && {
        engagement: payload.engagement,
      }),
      ...(payload.neededForWork !== undefined && {
        neededForWork: payload.neededForWork,
      }),
      ...(payload.cooperation !== undefined && {
        cooperation: payload.cooperation,
      }),
      ...(payload.technicalSkills !== undefined && {
        technicalSkills: payload.technicalSkills,
      }),
      ...(payload.organizationalSkills !== undefined && {
        organizationalSkills: payload.organizationalSkills,
      }),
      ...(payload.projectTaskSupport !== undefined && {
        projectTaskSupport: payload.projectTaskSupport,
      }),
      ...(payload.responsibility !== undefined && {
        responsibility: payload.responsibility,
      }),
      ...(payload.teamQuality !== undefined && {
        teamQuality: payload.teamQuality,
      }),
      ...(payload.totalPercentage !== undefined && {
        totalPercentage: payload.totalPercentage,
      }),
      ...(payload.supervisorSignature !== undefined && {
        supervisorSignature: payload.supervisorSignature ?? null,
      }),
    },
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

export async function getFinalEvaluationById(id: number) {
  return prisma.finalEvaluation.findUnique({
    where: { id },
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

export async function getFinalEvaluationsByStudentId(studentId: number) {
  return prisma.finalEvaluation.findMany({
    where: { studentId },
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
    orderBy: { createdAt: "desc" },
  });
}

export async function getFinalEvaluationsByCompanyId(companyId: number) {
  return prisma.finalEvaluation.findMany({
    where: { companyId },
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
    orderBy: { createdAt: "desc" },
  });
}
