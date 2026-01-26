import {
  createWeeklyReport,
  getWeeklyReportsByStudentId,
  getWeeklyReportsByCompanyId,
  CreateWeeklyReportPayload,
} from "@/services/weeklyReportService";

export type ControllerResult<T> = {
  status: number;
  body: T | { message: string };
};

export async function handleCreateWeeklyReport(
  payload: unknown
): Promise<ControllerResult<unknown>> {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("companyId" in payload) ||
    !("studentId" in payload) ||
    !("weekNumber" in payload) ||
    !("activity" in payload)
  ) {
    return {
      status: 400,
      body: {
        message:
          "Missing required fields: companyId, studentId, weekNumber, activity",
      },
    };
  }

  const { companyId, studentId, weekNumber, activity } =
    payload as CreateWeeklyReportPayload;

  if (
    typeof companyId !== "number" ||
    typeof studentId !== "number" ||
    typeof weekNumber !== "number" ||
    typeof activity !== "string"
  ) {
    return {
      status: 400,
      body: { message: "Invalid field types" },
    };
  }

  try {
    const report = await createWeeklyReport({
      companyId,
      studentId,
      weekNumber,
      activity,
    });
    return {
      status: 201,
      body: report,
    };
  } catch (error) {
    console.error("Error creating weekly report:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return {
        status: 404,
        body: { message: error.message },
      };
    }
    return {
      status: 500,
      body: { message: "Internal server error" },
    };
  }
}

export async function handleGetWeeklyReportsByStudentId(
  studentId: number
): Promise<ControllerResult<unknown>> {
  try {
    const reports = await getWeeklyReportsByStudentId(studentId);
    return {
      status: 200,
      body: reports,
    };
  } catch (error) {
    console.error("Error fetching weekly reports for student:", error);
    return {
      status: 500,
      body: { message: "Internal server error" },
    };
  }
}

export async function handleGetWeeklyReportsByCompanyId(
  companyId: number
): Promise<ControllerResult<unknown>> {
  try {
    const reports = await getWeeklyReportsByCompanyId(companyId);
    return {
      status: 200,
      body: reports,
    };
  } catch (error) {
    console.error("Error fetching weekly reports for company:", error);
    return {
      status: 500,
      body: { message: "Internal server error" },
    };
  }
}
