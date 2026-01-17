const openApiDocument = {
  openapi: "3.0.0",
  info: {
    title: "Student API",
    version: "1.0.0",
    description:
      "CRUD API for managing students built with Next.js App Router and Prisma.",
  },
  paths: {
    "/api/students": {
      get: {
        tags: ["Students"],
        summary: "Get all students",
        operationId: "getAllStudents",
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
              examples: {
                default: {
                  summary: "Example student",
                  value: {
                    name: "Jane Doe",
                    email: "jane.doe@example.com",
                    password: "strongpassword",
                    year: 2,
                    universityId: 1,
                    collegeId: 1,
                    departmentId: 1,
                  },
                },
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
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Student identifier",
          schema: {
            type: "integer",
            format: "int32",
          },
        },
      ],
      get: {
        tags: ["Students"],
        summary: "Get a student by id",
        operationId: "getStudentById",
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
  },
  components: {
    schemas: {
      Student: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            format: "int32",
          },
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
            format: "int32",
          },
          universityId: {
            type: "integer",
            format: "int32",
            nullable: true,
          },
          collegeId: {
            type: "integer",
            format: "int32",
            nullable: true,
          },
          departmentId: {
            type: "integer",
            format: "int32",
            nullable: true,
          },
        },
        required: ["id", "name", "email", "password", "year"],
      },
      StudentCreateInput: {
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
            format: "int32",
          },
          universityId: {
            type: "integer",
            format: "int32",
            nullable: true,
          },
          collegeId: {
            type: "integer",
            format: "int32",
            nullable: true,
          },
          departmentId: {
            type: "integer",
            format: "int32",
            nullable: true,
          },
        },
        required: ["name", "email", "password", "year"],
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
            format: "int32",
          },
          universityId: {
            type: "integer",
            format: "int32",
            nullable: true,
          },
          collegeId: {
            type: "integer",
            format: "int32",
            nullable: true,
          },
          departmentId: {
            type: "integer",
            format: "int32",
            nullable: true,
          },
        },
        additionalProperties: false,
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
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

