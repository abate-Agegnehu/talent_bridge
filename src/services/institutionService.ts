import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import {
  AdvisorAssignmentStatus,
  AdvisorStatus,
  RegistrationStatus,
  Role,
} from "@/generated/prisma/enums";

export type UniversityPayload = {
  name: string;
  email: string;
  password: string;
};

export type AdminPayload = {
  name: string;
  email: string;
  password: string;
};

export type CollegePayload = {
  name: string;
  universityId: number;
  email: string;
  password: string;
};

export type DepartmentPayload = {
  name: string;
  collegeId: number;
  email: string;
  password: string;
};

export type AdvisorPayload = {
  name: string;
  departmentId: number;
  email: string;
  password: string;
};

export type AdvisorUpdatePayload = Partial<Omit<AdvisorPayload, "departmentId">> & {
  departmentId?: number;
  status?: AdvisorStatus;
};

export type AdvisorAssignmentPayload = {
  studentId: number;
  status?: AdvisorAssignmentStatus;
};

export async function getAllUniversities() {
  try {
    // Use raw query to filter out universities with NULL userId, then fetch with relations
    const universityIds = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id FROM "University" WHERE "userId" IS NOT NULL ORDER BY id ASC
    `;

    if (universityIds.length === 0) {
      return [];
    }

    const ids = universityIds.map(u => u.id);

    try {
      return await prisma.university.findMany({
        where: {
          id: { in: ids },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          colleges: {
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
          id: "asc",
        },
      });
    } catch (error) {
      // If Prisma fails to load relations due to NULL userId, return empty array
      if ((error as { code?: string }).code === "P2032") {
        return [];
      }
      throw error;
    }
  } catch (error) {
    // Handle any other errors
    if ((error as { code?: string }).code === "P2032") {
      return [];
    }
    throw error;
  }
}

export async function getUniversityById(id: number) {
  try {
    // First check if university exists and has userId using raw query
    const universityCheck = await prisma.$queryRaw<Array<{ userId: number | null }>>`
      SELECT "userId" FROM "University" WHERE id = ${id}
    `;

    if (!universityCheck || universityCheck.length === 0) {
      return null;
    }

    if (universityCheck[0].userId === null) {
      // Return null if university has no user (old data that doesn't conform to schema)
      return null;
    }

    // Fetch university - we know userId is not null from the check above
    try {
      const university = await prisma.university.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          colleges: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
              departments: {
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
      });

      return university;
    } catch (error) {
      // If Prisma fails to load relations due to NULL userId, return null
      if ((error as { code?: string }).code === "P2032") {
        return null;
      }
      throw error;
    }
  } catch (error) {
    // If there's a Prisma error related to NULL userId, return null
    if ((error as { code?: string }).code === "P2032") {
      return null;
    }
    throw error;
  }
}

export async function getCollegesByUniversityId(universityId: number) {
  try {
    const collegeIds = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id FROM "College" WHERE "universityId" = ${universityId} AND "userId" IS NOT NULL ORDER BY id ASC
    `;

    if (collegeIds.length === 0) {
      return [];
    }

    const ids = collegeIds.map(c => c.id);

    try {
      return await prisma.college.findMany({
        where: {
          id: { in: ids },
        },
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
        orderBy: {
          id: "asc",
        },
      });
    } catch (error) {
      if ((error as { code?: string }).code === "P2032") {
        return [];
      }
      throw error;
    }
  } catch (error) {
    if ((error as { code?: string }).code === "P2032") {
      return [];
    }
    throw error;
  }
}

export async function createUniversity(payload: UniversityPayload) {
  // Use transaction to ensure atomicity with timeout
  return prisma.$transaction(
    async (tx) => {
      // Hash password before creating User
      const hashedPassword = await hashPassword(payload.password);
      
      // Create User first
      const user = await tx.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          password: hashedPassword,
          role: Role.UNIVERSITY,
        },
      });

      // Create University with userId (name comes from User)
      return tx.university.create({
        data: {
          userId: user.id,
        },
      });
    },
    {
      maxWait: 10000,
      timeout: 20000,
    },
  );
}

export async function updateUniversityStatus(id: number, status: RegistrationStatus) {
  return prisma.university.update({
    where: { id },
    data: { status },
  });
}

export async function createAdmin(payload: AdminPayload) {
  // Use transaction to ensure atomicity with timeout
  return prisma.$transaction(
    async (tx) => {
      // Hash password before creating User
      const hashedPassword = await hashPassword(payload.password);
      
      // Create User first
      const user = await tx.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          password: hashedPassword,
          role: Role.ADMIN,
        },
      });

      // Create Admin with userId (name comes from User)
      return tx.admin.create({
        data: {
          userId: user.id,
        },
      });
    },
    {
      maxWait: 10000,
      timeout: 20000,
    },
  );
}


export async function getAllColleges() {
  try {
    // Use raw query to filter out colleges with NULL userId, then fetch with relations
    const collegeIds = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id FROM "College" WHERE "userId" IS NOT NULL ORDER BY id ASC
    `;

    if (collegeIds.length === 0) {
      return [];
    }

    const ids = collegeIds.map(c => c.id);

    try {
      return await prisma.college.findMany({
        where: {
          id: { in: ids },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          university: {
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
          departments: {
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
          id: "asc",
        },
      });
    } catch (error) {
      // If Prisma fails to load relations due to NULL userId, return empty array
      if ((error as { code?: string }).code === "P2032") {
        return [];
      }
      throw error;
    }
  } catch (error) {
    // Handle any other errors
    if ((error as { code?: string }).code === "P2032") {
      return [];
    }
    throw error;
  }
}

export async function getCollegeById(id: number) {
  try {
    // First check if college exists and has userId using raw query
    const collegeCheck = await prisma.$queryRaw<Array<{ userId: number | null }>>`
      SELECT "userId" FROM "College" WHERE id = ${id}
    `;

    if (!collegeCheck || collegeCheck.length === 0) {
      return null;
    }

    if (collegeCheck[0].userId === null) {
      // Return null if college has no user (old data that doesn't conform to schema)
      return null;
    }

    // Fetch college - we know userId is not null from the check above
    try {
      const college = await prisma.college.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          university: {
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
          departments: {
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

      return college;
    } catch (error) {
      // If Prisma fails to load relations due to NULL userId, return null
      if ((error as { code?: string }).code === "P2032") {
        return null;
      }
      throw error;
    }
  } catch (error) {
    // If there's a Prisma error related to NULL userId, return null
    if ((error as { code?: string }).code === "P2032") {
      return null;
    }
    throw error;
  }
}

export async function createCollege(payload: CollegePayload) {
  // Use transaction to ensure atomicity with timeout
  return prisma.$transaction(
    async (tx) => {
    // Verify University exists (select only id to avoid relation issues with NULL userId)
    const university = await tx.university.findUnique({
      where: { id: payload.universityId },
      select: { id: true },
    });

    if (!university) {
      throw new Error(`University with id ${payload.universityId} does not exist`);
    }

    // Hash password before creating User
    const hashedPassword = await hashPassword(payload.password);
    
    // Create User first
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: Role.COLLEGE,
      },
    });

    // Create College with userId (name comes from User)
    return tx.college.create({
      data: {
        universityId: payload.universityId,
        userId: user.id,
      },
    });
  },
    {
      maxWait: 10000,
      timeout: 20000,
    },
  );
}

export async function createDepartment(payload: DepartmentPayload) {
  // Use transaction to ensure atomicity with timeout
  return prisma.$transaction(
    async (tx) => {
    // Verify College exists (select only id to avoid relation issues with NULL userId)
    const college = await tx.college.findUnique({
      where: { id: payload.collegeId },
      select: { id: true },
    });

    if (!college) {
      throw new Error(`College with id ${payload.collegeId} does not exist`);
    }

    // Hash password before creating User
    const hashedPassword = await hashPassword(payload.password);
    
    // Create User first
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: Role.DEPARTMENT,
      },
    });

    // Create Department with userId (name comes from User)
    return tx.department.create({
      data: {
        collegeId: payload.collegeId,
        userId: user.id,
      },
    });
  },
    {
      maxWait: 10000,
      timeout: 20000,
    },
  );
}

export async function getAllDepartments() {
  try {
    // Use raw query to filter out departments with NULL userId, then fetch with relations
    const departmentIds = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id FROM "Department" WHERE "userId" IS NOT NULL ORDER BY id ASC
    `;

    if (departmentIds.length === 0) {
      return [];
    }

    const ids = departmentIds.map(d => d.id);

    try {
      return await prisma.department.findMany({
        where: {
          id: { in: ids },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          college: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
              university: {
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
          advisors: {
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
          id: "asc",
        },
      });
    } catch (error) {
      // If Prisma fails to load relations due to NULL userId, return empty array
      if ((error as { code?: string }).code === "P2032") {
        return [];
      }
      throw error;
    }
  } catch (error) {
    // Handle any other errors
    if ((error as { code?: string }).code === "P2032") {
      return [];
    }
    throw error;
  }
}

export async function getDepartmentById(id: number) {
  try {
    // First check if department exists and has userId using raw query
    const departmentCheck = await prisma.$queryRaw<Array<{ userId: number | null }>>`
      SELECT "userId" FROM "Department" WHERE id = ${id}
    `;

    if (!departmentCheck || departmentCheck.length === 0) {
      return null;
    }

    if (departmentCheck[0].userId === null) {
      // Return null if department has no user (old data that doesn't conform to schema)
      return null;
    }

    // Fetch department - we know userId is not null from the check above
    try {
      const department = await prisma.department.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          college: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
              university: {
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
          advisors: {
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
          students: {
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

      return department;
    } catch (error) {
      // If Prisma fails to load relations due to NULL userId, return null
      if ((error as { code?: string }).code === "P2032") {
        return null;
      }
      throw error;
    }
  } catch (error) {
    // If there's a Prisma error related to NULL userId, return null
    if ((error as { code?: string }).code === "P2032") {
      return null;
    }
    throw error;
  }
}

export async function getAllAdvisors() {
  try {
    // Use raw query to filter out advisors with NULL userId, then fetch with relations
    const advisorIds = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id FROM "Advisor" WHERE "userId" IS NOT NULL ORDER BY id ASC
    `;

    if (advisorIds.length === 0) {
      return [];
    }

    const ids = advisorIds.map(a => a.id);

    try {
      return await prisma.advisor.findMany({
        where: {
          id: { in: ids },
        },
        include: {
          department: {
            include: {
              college: {
                include: {
                  university: true,
                },
              },
            },
          },
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
    } catch (error) {
      // If Prisma fails to load relations due to NULL userId, return empty array
      if ((error as { code?: string }).code === "P2032") {
        return [];
      }
      throw error;
    }
  } catch (error) {
    // Handle any other errors
    if ((error as { code?: string }).code === "P2032") {
      return [];
    }
    throw error;
  }
}

export async function getAdvisorsByDepartmentId(departmentId: number) {
  try {
    // Verify Department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      select: { id: true },
    });

    if (!department) {
      throw new Error(`Department with id ${departmentId} does not exist`);
    }

    // Use raw query to filter out advisors with NULL userId and filter by department
    const advisorIds = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id 
      FROM "Advisor"
      WHERE "userId" IS NOT NULL 
        AND "departmentId" = ${departmentId}
      ORDER BY id ASC
    `;

    if (advisorIds.length === 0) {
      return [];
    }

    const ids = advisorIds.map(a => a.id);

    try {
      return await prisma.advisor.findMany({
        where: {
          id: { in: ids },
        },
        include: {
          department: {
            include: {
              college: {
                include: {
                  university: {
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
          },
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
    } catch (error) {
      // If Prisma fails to load relations due to NULL userId, return empty array
      if ((error as { code?: string }).code === "P2032") {
        return [];
      }
      throw error;
    }
  } catch (error) {
    // Handle any other errors
    if ((error as { code?: string }).code === "P2032") {
      return [];
    }
    throw error;
  }
}

export async function getApprovedAdvisorsByDepartmentId(departmentId: number) {
  try {
    // Verify Department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      select: { id: true },
    });

    if (!department) {
      throw new Error(`Department with id ${departmentId} does not exist`);
    }

    // Use raw query to filter out advisors with NULL userId and filter by department + APPROVED status
    const advisorIds = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id 
      FROM "Advisor"
      WHERE "userId" IS NOT NULL 
        AND "departmentId" = ${departmentId}
        AND "status" = 'APPROVED'
      ORDER BY id ASC
    `;

    if (advisorIds.length === 0) {
      return [];
    }

    const ids = advisorIds.map((a) => a.id);

    try {
      return await prisma.advisor.findMany({
        where: {
          id: { in: ids },
        },
        include: {
          department: {
            include: {
              college: {
                include: {
                  university: {
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
          },
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
    } catch (error) {
      // If Prisma fails to load relations due to NULL userId, return empty array
      if ((error as { code?: string }).code === "P2032") {
        return [];
      }
      throw error;
    }
  } catch (error) {
    // Handle any other errors
    if ((error as { code?: string }).code === "P2032") {
      return [];
    }
    throw error;
  }
}

export async function assignAdvisorToStudent(
  advisorId: number,
  payload: AdvisorAssignmentPayload,
) {
  return prisma.$transaction(
    async (tx) => {
      const advisor = await tx.advisor.findUnique({
        where: { id: advisorId },
        select: { departmentId: true, status: true },
      });

      if (!advisor) {
        throw new Error("Advisor not found");
      }

      if (advisor.status !== AdvisorStatus.APPROVED) {
        throw new Error("Advisor is not approved");
      }

      const student = await tx.student.findUnique({
        where: { id: payload.studentId },
        select: { departmentId: true },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      if (!student.departmentId) {
        throw new Error("Student is not linked to a department");
      }

      if (student.departmentId !== advisor.departmentId) {
        throw new Error(
          "Student and advisor must belong to the same department",
        );
      }

      return tx.advisorAssignment.create({
        data: {
          advisorId,
          studentId: payload.studentId,
          status: payload.status ?? AdvisorAssignmentStatus.ACTIVE,
        },
        include: {
          advisor: {
            include: {
              user: { select: { id: true, name: true, email: true, role: true } },
            },
          },
          student: {
            include: {
              user: { select: { id: true, name: true, email: true, role: true } },
              department: true,
            },
          },
        },
      });
    },
    { maxWait: 10000, timeout: 20000 },
  );
}

export async function getStudentsByAdvisorId(advisorId: number) {
  // ensure advisor exists
  const advisor = await prisma.advisor.findUnique({
    where: { id: advisorId },
    select: { id: true },
  });

  if (!advisor) {
    throw new Error("Advisor not found");
  }

  return prisma.advisorAssignment.findMany({
    where: { advisorId },
    include: {
      student: {
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
          department: true,
        },
      },
    },
    orderBy: { assignedAt: "desc" },
  });
}

export async function getAdvisorsByStudentId(studentId: number) {
  // ensure student exists
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { id: true },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  return prisma.advisorAssignment.findMany({
    where: {
      studentId,
      status: AdvisorAssignmentStatus.ACTIVE,
    },
    include: {
      advisor: {
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
          department: {
            include: {
              college: {
                include: {
                  university: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { assignedAt: "desc" },
  });
}

export async function getAdvisorsByCollegeAndDepartmentId(
  collegeId: number,
  departmentId: number,
) {
  try {
    // Verify Department exists and belongs to the given College
    const department = await prisma.department.findFirst({
      where: {
        id: departmentId,
        collegeId,
      },
      select: { id: true },
    });

    if (!department) {
      throw new Error(
        `Department with id ${departmentId} does not belong to College with id ${collegeId} or does not exist`,
      );
    }

    // Use raw query to filter out advisors with NULL userId and match by department/college
    const advisorIds = await prisma.$queryRaw<Array<{ id: number }>>`
      SELECT a.id
      FROM "Advisor" a
      JOIN "Department" d ON a."departmentId" = d.id
      WHERE a."userId" IS NOT NULL
        AND d."collegeId" = ${collegeId}
        AND d.id = ${departmentId}
      ORDER BY a.id ASC
    `;

    if (advisorIds.length === 0) {
      return [];
    }

    const ids = advisorIds.map((a) => a.id);

    try {
      return await prisma.advisor.findMany({
        where: {
          id: { in: ids },
        },
        include: {
          department: {
            include: {
              college: {
                include: {
                  university: {
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
    } catch (error) {
      // If Prisma fails to load relations due to NULL userId, return empty array
      if ((error as { code?: string }).code === "P2032") {
        return [];
      }
      throw error;
    }
  } catch (error) {
    // Handle any other errors
    if ((error as { code?: string }).code === "P2032") {
      return [];
    }
    throw error;
  }
}

export async function getAdvisorById(id: number) {
  try {
    // First check if advisor exists and has userId using raw query
    const advisorCheck = await prisma.$queryRaw<Array<{ userId: number | null }>>`
      SELECT "userId" FROM "Advisor" WHERE id = ${id}
    `;

    if (!advisorCheck || advisorCheck.length === 0) {
      return null;
    }

    if (advisorCheck[0].userId === null) {
      // Return null if advisor has no user (old data that doesn't conform to schema)
      return null;
    }

    // Fetch advisor - we know userId is not null from the check above
    try {
      const advisor = await prisma.advisor.findUnique({
        where: { id },
        include: {
          department: {
            include: {
              college: {
                include: {
                  university: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return advisor;
    } catch (error) {
      // If Prisma fails to load relations due to NULL userId, return null
      if ((error as { code?: string }).code === "P2032") {
        return null;
      }
      throw error;
    }
  } catch (error) {
    // If there's a Prisma error related to NULL userId, return null
    if ((error as { code?: string }).code === "P2032") {
      return null;
    }
    throw error;
  }
}

export async function createAdvisor(payload: AdvisorPayload) {
  // Use transaction to ensure atomicity with timeout
  return prisma.$transaction(
    async (tx) => {
    // Verify Department exists (select only id to avoid relation issues with NULL userId)
    const department = await tx.department.findUnique({
      where: { id: payload.departmentId },
      select: { id: true },
    });

    if (!department) {
      throw new Error(`Department with id ${payload.departmentId} does not exist`);
    }

    // Hash password before creating User
    const hashedPassword = await hashPassword(payload.password);
    
    // Create User first
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: Role.ADVISOR,
      },
    });

    // Create Advisor with userId (name comes from User)
    return tx.advisor.create({
      data: {
        departmentId: payload.departmentId,
        userId: user.id,
      },
    });
  });
}

export async function updateAdvisor(id: number, payload: AdvisorUpdatePayload) {
  return prisma.$transaction(
    async (tx) => {
    // Get the advisor to find the userId
    const advisor = await tx.advisor.findUnique({
      where: { id },
      select: { userId: true, departmentId: true },
    });

    if (!advisor) {
      throw new Error("Advisor not found");
    }

    // Verify Department exists if departmentId is being updated
    if (payload.departmentId !== undefined && payload.departmentId !== advisor.departmentId) {
      const department = await tx.department.findUnique({
        where: { id: payload.departmentId },
        select: { id: true },
      });

      if (!department) {
        throw new Error(`Department with id ${payload.departmentId} does not exist`);
      }
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
        where: { id: advisor.userId },
        data: updateData,
      });
    }

    // Update Advisor fields (departmentId, status)
    return tx.advisor.update({
      where: { id },
      data: {
        ...(payload.departmentId !== undefined && { departmentId: payload.departmentId }),
        ...(payload.status !== undefined && { status: payload.status }),
      },
    });
  },
    {
      maxWait: 10000,
      timeout: 20000,
    },
  );
}

export async function deleteAdvisor(id: number) {
  return prisma.$transaction(async (tx) => {
    // Get the advisor to find the userId
    const advisor = await tx.advisor.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!advisor) {
      throw new Error("Advisor not found");
    }

    // Delete the advisor first
    await tx.advisor.delete({
      where: { id },
    });

    // Delete the associated user
    await tx.user.delete({
      where: { id: advisor.userId },
    });

    return { id, deleted: true };
  },
    {
      maxWait: 10000,
      timeout: 20000,
    },
  );
}
