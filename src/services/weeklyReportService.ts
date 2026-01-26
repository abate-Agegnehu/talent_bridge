import prisma from "@/lib/prisma";

export type CreateWeeklyReportPayload = {
  companyId: number;
  studentId: number;
  weekNumber: number;
  activity: string;
};

export async function createWeeklyReport(payload: CreateWeeklyReportPayload) {
  const { companyId, studentId, weekNumber, activity } = payload;

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

  // Check if a report for this week already exists for this student
  // Note: The schema doesn't enforce uniqueness on [studentId, weekNumber], 
  // but it's generally good practice to avoid duplicates or handle them.
  // For now, we will just create a new one as per the simple schema.
  
  const weeklyReport = await prisma.weeklyReport.create({
    data: {
      companyId,
      studentId,
      weekNumber,
      activity,
    },
  });

  return weeklyReport;
}

export async function getWeeklyReportsByStudentId(studentId: number) {
  return prisma.weeklyReport.findMany({
    where: { studentId },
    orderBy: { weekNumber: 'asc' },
  });
}

export async function getWeeklyReportsByCompanyId(companyId: number) {
  return prisma.weeklyReport.findMany({
    where: { companyId },
    include: {
        student: {
            include: {
                user: true
            }
        }
    },
    orderBy: { weekNumber: 'asc' },
  });
}
