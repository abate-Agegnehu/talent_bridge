import prisma from "@/lib/prisma";

export type CreateFinalEvaluationPayload = {
  supervisorName: string;
  studentId: number;
  companyId: number;

  // General Performance
  punctuality: number;
  reliability: number;
  independenceInWork: number;
  communication: number;
  professionalism: number;

  // Personal Skills
  speedOfWork: number;
  accuracy: number;
  engagement: number;
  neededForWork: number;
  cooperation: number;

  // Professional Skills
  technicalSkills: number;
  organizationalSkills: number;
  projectTaskSupport: number;
  responsibility: number;
  teamQuality: number;

  supervisorSignature?: string;
};

export async function createFinalEvaluation(payload: CreateFinalEvaluationPayload) {
  // Calculate total percentage
  const generalPerformance =
    payload.punctuality +
    payload.reliability +
    payload.independenceInWork +
    payload.communication +
    payload.professionalism;
  
  const personalSkills =
    payload.speedOfWork +
    payload.accuracy +
    payload.engagement +
    payload.neededForWork +
    payload.cooperation;
  
  const professionalSkills =
    payload.technicalSkills +
    payload.organizationalSkills +
    payload.projectTaskSupport +
    payload.responsibility +
    payload.teamQuality;

  const totalPercentage = generalPerformance + personalSkills + professionalSkills;

  return prisma.finalEvaluation.create({
    data: {
      supervisorName: payload.supervisorName,
      studentId: payload.studentId,
      companyId: payload.companyId,
      
      punctuality: payload.punctuality,
      reliability: payload.reliability,
      independenceInWork: payload.independenceInWork,
      communication: payload.communication,
      professionalism: payload.professionalism,
      
      speedOfWork: payload.speedOfWork,
      accuracy: payload.accuracy,
      engagement: payload.engagement,
      neededForWork: payload.neededForWork,
      cooperation: payload.cooperation,
      
      technicalSkills: payload.technicalSkills,
      organizationalSkills: payload.organizationalSkills,
      projectTaskSupport: payload.projectTaskSupport,
      responsibility: payload.responsibility,
      teamQuality: payload.teamQuality,
      
      totalPercentage,
      supervisorSignature: payload.supervisorSignature,
    },
    include: {
        student: true,
        company: true
    }
  });
}

export async function getFinalEvaluationById(id: number) {
  return prisma.finalEvaluation.findUnique({
    where: { id },
    include: {
      student: true,
      company: true,
    },
  });
}

export async function getFinalEvaluationsByStudentId(studentId: number) {
    return prisma.finalEvaluation.findMany({
        where: { studentId },
        include: {
            company: true
        }
    });
}

export async function getFinalEvaluationsByCompanyId(companyId: number) {
    return prisma.finalEvaluation.findMany({
        where: { companyId },
        include: {
            student: true
        }
    });
}
