const openApiDocument = {
  openapi: "3.0.0",
  info: {
    title: "Talent Bridge API",
    version: "1.0.0",
    description:
      "Complete API documentation for Talent Bridge - A platform connecting students, universities, companies, and advisors for internships and career opportunities.",
    contact: {
      name: "API Support",
      email: "support@talentbridge.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  tags: [
    { name: "Authentication", description: "User authentication endpoints" },
    { name: "Universities", description: "University management endpoints" },
    { name: "Colleges", description: "College management endpoints" },
    { name: "Departments", description: "Department management endpoints" },
    { name: "Advisors", description: "Advisor management endpoints" },
    { name: "Students", description: "Student management endpoints" },
    { name: "Companies", description: "Company management endpoints" },
    { name: "Internships", description: "Internship management endpoints" },
    { name: "Internship Applications", description: "Internship application endpoints" },
    { name: "Messages", description: "Messaging endpoints" },
  ],
  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "User login",
        operationId: "loginUser",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginInput",
              },
              example: {
                email: "user@example.com",
                password: "password123",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
                },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/universities": {
      get: {
        tags: ["Universities"],
        summary: "Get all universities",
        operationId: "getAllUniversities",
        responses: {
          "200": {
            description: "List of universities",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/University",
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Universities"],
        summary: "Create a new university",
        operationId: "createUniversity",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UniversityCreateInput",
              },
              example: {
                name: "Cairo University",
                email: "info@cairo-university.edu",
                password: "UniversityPass123!",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "University created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/University",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/universities/{id}": {
      get: {
        tags: ["Universities"],
        summary: "Get university by ID",
        operationId: "getUniversityById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "University ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "University found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/University",
                },
              },
            },
          },
          "404": {
            description: "University not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "400": {
            description: "Invalid ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/colleges": {
      get: {
        tags: ["Colleges"],
        summary: "Get all colleges",
        operationId: "getAllColleges",
        responses: {
          "200": {
            description: "List of colleges",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/College",
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Colleges"],
        summary: "Create a new college",
        operationId: "createCollege",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CollegeCreateInput",
              },
              example: {
                name: "Faculty of Engineering",
                universityId: 1,
                email: "engineering@cairo-university.edu",
                password: "EngineeringPass123!",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "College created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/College",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/colleges/{id}": {
      get: {
        tags: ["Colleges"],
        summary: "Get college by ID",
        operationId: "getCollegeById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "College ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "College found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/College",
                },
              },
            },
          },
          "404": {
            description: "College not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/departments": {
      get: {
        tags: ["Departments"],
        summary: "Get all departments",
        operationId: "getAllDepartments",
        responses: {
          "200": {
            description: "List of departments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Department",
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Departments"],
        summary: "Create a new department",
        operationId: "createDepartment",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DepartmentCreateInput",
              },
              example: {
                name: "Computer Science",
                collegeId: 1,
                email: "cs@cairo-university.edu",
                password: "CSPass123!",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Department created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Department",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/departments/{id}": {
      get: {
        tags: ["Departments"],
        summary: "Get department by ID",
        operationId: "getDepartmentById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Department ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Department found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Department",
                },
              },
            },
          },
          "404": {
            description: "Department not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/advisors": {
      get: {
        tags: ["Advisors"],
        summary: "Get all advisors",
        operationId: "getAllAdvisors",
        responses: {
          "200": {
            description: "List of advisors",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Advisor",
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Advisors"],
        summary: "Create a new advisor",
        operationId: "createAdvisor",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AdvisorCreateInput",
              },
              example: {
                name: "Dr. Ahmed Ali",
                departmentId: 1,
                email: "ahmed.ali@cairo-university.edu",
                password: "AdvisorPass123!",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Advisor created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Advisor",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/advisors/{id}": {
      get: {
        tags: ["Advisors"],
        summary: "Get advisor by ID",
        operationId: "getAdvisorById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Advisor ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Advisor found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Advisor",
                },
              },
            },
          },
          "404": {
            description: "Advisor not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Advisors"],
        summary: "Update advisor",
        operationId: "updateAdvisor",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Advisor ID",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AdvisorUpdateInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Advisor updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Advisor",
                },
              },
            },
          },
          "404": {
            description: "Advisor not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Advisors"],
        summary: "Delete advisor",
        operationId: "deleteAdvisor",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Advisor ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Advisor deleted",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Advisor",
                },
              },
            },
          },
          "404": {
            description: "Advisor not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/advisors/departments/{departmentId}": {
      get: {
        tags: ["Advisors"],
        summary: "Get advisors by department ID",
        operationId: "getAdvisorsByDepartmentId",
        parameters: [
          {
            name: "departmentId",
            in: "path",
            required: true,
            description: "Department ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "List of advisors",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Advisor",
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid department ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/students": {
      get: {
        tags: ["Students"],
        summary: "Get all students with optional filters",
        operationId: "getAllStudents",
        parameters: [
          {
            name: "universityId",
            in: "query",
            required: false,
            description: "Filter by university ID",
            schema: {
              type: "integer",
            },
          },
          {
            name: "collegeId",
            in: "query",
            required: false,
            description: "Filter by college ID",
            schema: {
              type: "integer",
            },
          },
          {
            name: "departmentId",
            in: "query",
            required: false,
            description: "Filter by department ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "List of students",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Student",
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Students"],
        summary: "Create a new student",
        operationId: "createStudent",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/StudentCreateInput",
              },
              example: {
                name: "Ahmed Hassan",
                email: "ahmed.hassan@university.edu",
                password: "StudentPass123!",
                year: 4,
                universityId: 1,
                collegeId: 1,
                departmentId: 1,
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Student created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Student",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/students/{id}": {
      get: {
        tags: ["Students"],
        summary: "Get a student by id",
        operationId: "getStudentById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Student identifier",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Student found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Student",
                },
              },
            },
          },
          "400": {
            description: "Invalid id",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "Student not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Students"],
        summary: "Update a student",
        operationId: "updateStudent",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Student identifier",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/StudentUpdateInput",
              },
              examples: {
                default: {
                  summary: "Update student year",
                  value: {
                    year: 3,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Student updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Student",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "Student not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Students"],
        summary: "Delete a student",
        operationId: "deleteStudent",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Student identifier",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Student deleted",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Student",
                },
              },
            },
          },
          "400": {
            description: "Invalid id",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "Student not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/companies": {
      get: {
        tags: ["Companies"],
        summary: "Get all companies",
        operationId: "getAllCompanies",
        responses: {
          "200": {
            description: "List of companies",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Company",
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Companies"],
        summary: "Create a new company",
        operationId: "createCompany",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CompanyCreateInput",
              },
              example: {
                name: "Tech Corp",
                email: "contact@techcorp.com",
                password: "CompanyPass123!",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Company created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Company",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/companies/{id}": {
      get: {
        tags: ["Companies"],
        summary: "Get company by ID",
        operationId: "getCompanyById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Company ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Company found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Company",
                },
              },
            },
          },
          "404": {
            description: "Company not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Companies"],
        summary: "Update company",
        operationId: "updateCompany",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Company ID",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CompanyUpdateInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Company updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Company",
                },
              },
            },
          },
          "404": {
            description: "Company not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Companies"],
        summary: "Delete company",
        operationId: "deleteCompany",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Company ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Company deleted",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Company",
                },
              },
            },
          },
          "404": {
            description: "Company not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/internships": {
      get: {
        tags: ["Internships"],
        summary: "Get all internships",
        operationId: "getAllInternships",
        responses: {
          "200": {
            description: "List of internships",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Internship",
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Internships"],
        summary: "Create a new internship",
        operationId: "createInternship",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternshipCreateInput",
              },
              example: {
                companyId: 1,
                title: "Software Engineering Intern",
                description: "Join our team as a software engineering intern",
                requirements: "Knowledge of JavaScript, React",
                responsibilities: "Develop features, write tests",
                location: "Cairo, Egypt",
                type: "ONSITE",
                duration: "3 Months",
                stipend: 5000,
                applicationDeadline: "2024-12-31T23:59:59Z",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Internship created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Internship",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/internships/companies/{companyId}": {
      get: {
        tags: ["Internships"],
        summary: "Get internships by company ID",
        operationId: "getInternshipsByCompanyId",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            description: "Company ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "List of internships",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Internship",
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid company ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/internships/applications": {
      post: {
        tags: ["Internship Applications"],
        summary: "Create an internship application",
        operationId: "createInternshipApplication",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InternshipApplicationCreateInput",
              },
              example: {
                internshipId: 1,
                studentId: 1,
                coverLetter: "I am excited to apply...",
                resumeUrl: "https://example.com/resume.pdf",
                portfolioUrl: "https://github.com/student",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Application created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/InternshipApplication",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/internships/applications/students/{studentId}": {
      get: {
        tags: ["Internship Applications"],
        summary: "Get internship applications by student ID",
        operationId: "getInternshipApplicationsByStudentId",
        parameters: [
          {
            name: "studentId",
            in: "path",
            required: true,
            description: "Student ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "List of applications",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/InternshipApplication",
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid student ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/internships/applications/companies/{companyId}": {
      get: {
        tags: ["Internship Applications"],
        summary: "Get internship applications by company ID",
        operationId: "getInternshipApplicationsByCompanyId",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            description: "Company ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "List of applications",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/InternshipApplication",
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid company ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/internships/applications/companies/{companyId}/internship/{internshipId}": {
      get: {
        tags: ["Internship Applications"],
        summary: "Get internship applications by company ID and internship ID",
        operationId: "getInternshipApplicationsByCompanyIdAndInternshipId",
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            description: "Company ID",
            schema: {
              type: "integer",
            },
          },
          {
            name: "internshipId",
            in: "path",
            required: true,
            description: "Internship ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "List of applications",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/InternshipApplication",
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid company ID or internship ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description:
              "Company not found, internship not found, or internship does not belong to the company",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/internships/applications/student/{studentId}/internship/{internshipId}": {
      put: {
        tags: ["Internship Applications"],
        summary: "Update internship application status",
        operationId: "updateInternshipApplicationStatus",
        parameters: [
          {
            name: "studentId",
            in: "path",
            required: true,
            description: "Student ID",
            schema: {
              type: "integer",
            },
          },
          {
            name: "internshipId",
            in: "path",
            required: true,
            description: "Internship ID",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["PENDING", "ACCEPTED", "REJECTED"],
                    description: "New application status",
                  },
                },
              },
              example: {
                status: "ACCEPTED",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Application status updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/InternshipApplication",
                },
              },
            },
          },
          "400": {
            description: "Invalid student ID, internship ID, or status",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description:
              "Student not found, internship not found, or application does not exist",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/messages/upload": {
      post: {
        tags: ["Messages"],
        summary: "Upload a file for messaging",
        operationId: "uploadMessageFile",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "File to upload (max 10MB)",
                  },
                },
                required: ["file"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "File uploaded successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    fileUrl: {
                      type: "string",
                    },
                    fileName: {
                      type: "string",
                    },
                    fileType: {
                      type: "string",
                    },
                    fileSize: {
                      type: "integer",
                    },
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "No file provided or file too large",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/messages": {
      post: {
        tags: ["Messages"],
        summary: "Create a new message",
        operationId: "createMessage",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageCreateInput",
              },
              examples: {
                textOnly: {
                  summary: "Text message",
                  value: {
                    senderId: 1,
                    receiverId: 2,
                    text: "Hello! This is a text message.",
                  },
                },
                fileOnly: {
                  summary: "File message",
                  value: {
                    senderId: 1,
                    receiverId: 2,
                    messageType: "FILE",
                    fileUrl: "http://localhost:3000/uploads/file.pdf",
                    fileName: "document.pdf",
                    fileType: "application/pdf",
                    fileSize: 1024000,
                  },
                },
                textAndFile: {
                  summary: "Text and file message",
                  value: {
                    senderId: 1,
                    receiverId: 2,
                    text: "Please find the attached document.",
                    fileUrl: "http://localhost:3000/uploads/file.pdf",
                    fileName: "document.pdf",
                    fileType: "application/pdf",
                    fileSize: 1024000,
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Message created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Message",
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/messages/conversation": {
      get: {
        tags: ["Messages"],
        summary: "Get messages between two users",
        operationId: "getMessagesBySenderAndReceiver",
        parameters: [
          {
            name: "senderId",
            in: "query",
            required: true,
            description: "Sender user ID",
            schema: {
              type: "integer",
            },
          },
          {
            name: "receiverId",
            in: "query",
            required: true,
            description: "Receiver user ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "List of messages",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Message",
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid parameters",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/messages/{id}/read": {
      put: {
        tags: ["Messages"],
        summary: "Mark a message as read",
        operationId: "markMessageAsRead",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Message ID",
            schema: {
              type: "string",
            },
          },
          {
            name: "userId",
            in: "query",
            required: false,
            description: "User ID (can also be provided in body)",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: {
                    type: "integer",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Message marked as read",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Message",
                },
              },
            },
          },
          "400": {
            description: "Invalid parameters",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "404": {
            description: "Message not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/messages/receiver/{receiverId}/read-all": {
      put: {
        tags: ["Messages"],
        summary: "Mark all messages as read for a receiver",
        operationId: "markAllMessagesAsRead",
        parameters: [
          {
            name: "receiverId",
            in: "path",
            required: true,
            description: "Receiver user ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "All messages marked as read",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    count: {
                      type: "integer",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid receiver ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/messages/receiver/{receiverId}/unread-count": {
      get: {
        tags: ["Messages"],
        summary: "Get count of unread messages for a receiver",
        operationId: "countUnreadMessages",
        parameters: [
          {
            name: "receiverId",
            in: "path",
            required: true,
            description: "Receiver user ID",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Unread message count",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    count: {
                      type: "integer",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid receiver ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          name: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          role: {
            type: "string",
            enum: ["UNIVERSITY", "COMPANY", "COLLEGE", "DEPARTMENT", "ADVISOR", "STUDENT"],
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      University: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          userId: {
            type: "integer",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      UniversityCreateInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
        },
      },
      College: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          universityId: {
            type: "integer",
          },
          userId: {
            type: "integer",
          },
          university: {
            $ref: "#/components/schemas/University",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      CollegeCreateInput: {
        type: "object",
        required: ["name", "universityId", "email", "password"],
        properties: {
          name: {
            type: "string",
          },
          universityId: {
            type: "integer",
          },
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
        },
      },
      Department: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          collegeId: {
            type: "integer",
          },
          userId: {
            type: "integer",
          },
          college: {
            $ref: "#/components/schemas/College",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      DepartmentCreateInput: {
        type: "object",
        required: ["name", "collegeId", "email", "password"],
        properties: {
          name: {
            type: "string",
          },
          collegeId: {
            type: "integer",
          },
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
        },
      },
      Advisor: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          departmentId: {
            type: "integer",
          },
          userId: {
            type: "integer",
          },
          department: {
            $ref: "#/components/schemas/Department",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      AdvisorCreateInput: {
        type: "object",
        required: ["name", "departmentId", "email", "password"],
        properties: {
          name: {
            type: "string",
          },
          departmentId: {
            type: "integer",
          },
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
        },
      },
      AdvisorUpdateInput: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
          departmentId: {
            type: "integer",
          },
        },
      },
      Student: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          year: {
            type: "integer",
          },
          universityId: {
            type: "integer",
            nullable: true,
          },
          collegeId: {
            type: "integer",
            nullable: true,
          },
          departmentId: {
            type: "integer",
            nullable: true,
          },
          userId: {
            type: "integer",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      StudentCreateInput: {
        type: "object",
        required: ["name", "email", "password", "year"],
        properties: {
          name: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
          year: {
            type: "integer",
          },
          universityId: {
            type: "integer",
            nullable: true,
          },
          collegeId: {
            type: "integer",
            nullable: true,
          },
          departmentId: {
            type: "integer",
            nullable: true,
          },
        },
      },
      StudentUpdateInput: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
          year: {
            type: "integer",
          },
          universityId: {
            type: "integer",
            nullable: true,
          },
          collegeId: {
            type: "integer",
            nullable: true,
          },
          departmentId: {
            type: "integer",
            nullable: true,
          },
        },
        additionalProperties: false,
      },
      Company: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          userId: {
            type: "integer",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      CompanyCreateInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
        },
      },
      CompanyUpdateInput: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
        },
      },
      Internship: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          companyId: {
            type: "integer",
          },
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          requirements: {
            type: "string",
            nullable: true,
          },
          responsibilities: {
            type: "string",
            nullable: true,
          },
          location: {
            type: "string",
          },
          type: {
            type: "string",
            enum: ["REMOTE", "ONSITE", "HYBRID"],
          },
          duration: {
            type: "string",
          },
          stipend: {
            type: "number",
            format: "float",
            nullable: true,
          },
          applicationDeadline: {
            type: "string",
            format: "date-time",
          },
          status: {
            type: "string",
            enum: ["OPEN", "CLOSED", "FILLED"],
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      InternshipCreateInput: {
        type: "object",
        required: ["companyId", "title", "description", "location", "type", "duration", "applicationDeadline"],
        properties: {
          companyId: {
            type: "integer",
          },
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          requirements: {
            type: "string",
            nullable: true,
          },
          responsibilities: {
            type: "string",
            nullable: true,
          },
          location: {
            type: "string",
          },
          type: {
            type: "string",
            enum: ["REMOTE", "ONSITE", "HYBRID"],
          },
          duration: {
            type: "string",
          },
          stipend: {
            type: "number",
            format: "float",
            nullable: true,
          },
          applicationDeadline: {
            type: "string",
            format: "date-time",
          },
        },
      },
      InternshipApplication: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          internshipId: {
            type: "integer",
          },
          studentId: {
            type: "integer",
          },
          coverLetter: {
            type: "string",
          },
          resumeUrl: {
            type: "string",
            nullable: true,
          },
          portfolioUrl: {
            type: "string",
            nullable: true,
          },
          status: {
            type: "string",
            enum: ["PENDING", "ACCEPTED", "REJECTED"],
          },
          appliedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      InternshipApplicationCreateInput: {
        type: "object",
        required: ["internshipId", "studentId", "coverLetter"],
        properties: {
          internshipId: {
            type: "integer",
          },
          studentId: {
            type: "integer",
          },
          coverLetter: {
            type: "string",
          },
          resumeUrl: {
            type: "string",
            nullable: true,
          },
          portfolioUrl: {
            type: "string",
            nullable: true,
          },
        },
      },
      Message: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          senderId: {
            type: "integer",
          },
          receiverId: {
            type: "integer",
          },
          messageType: {
            type: "string",
            enum: ["TEXT", "FILE", "TEXT_AND_FILE"],
          },
          text: {
            type: "string",
            nullable: true,
          },
          fileUrl: {
            type: "string",
            nullable: true,
          },
          fileName: {
            type: "string",
            nullable: true,
          },
          fileType: {
            type: "string",
            nullable: true,
          },
          fileSize: {
            type: "integer",
            nullable: true,
          },
          isRead: {
            type: "boolean",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
          sender: {
            $ref: "#/components/schemas/User",
          },
          receiver: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      MessageCreateInput: {
        type: "object",
        required: ["senderId", "receiverId"],
        properties: {
          senderId: {
            type: "integer",
          },
          receiverId: {
            type: "integer",
          },
          messageType: {
            type: "string",
            enum: ["TEXT", "FILE", "TEXT_AND_FILE"],
            description: "Auto-determined if not provided",
          },
          text: {
            type: "string",
            nullable: true,
          },
          fileUrl: {
            type: "string",
            nullable: true,
          },
          fileName: {
            type: "string",
            nullable: true,
          },
          fileType: {
            type: "string",
            nullable: true,
          },
          fileSize: {
            type: "integer",
            nullable: true,
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
          error: {
            type: "string",
            nullable: true,
          },
          details: {
            type: "string",
            nullable: true,
          },
        },
        required: ["message"],
      },
    },
  },
};

export async function GET() {
  return Response.json(openApiDocument);
}
