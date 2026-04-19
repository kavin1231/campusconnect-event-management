const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "CampusConnect Backend API",
    version: "1.0.0",
    description: "API documentation for CampusConnect backend services",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Events" },
    { name: "Dashboard" },
    { name: "Logistics" },
    { name: "President" },
    { name: "Vendor" },
    { name: "Sponsorship" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["Health"],
        summary: "API health welcome",
        responses: {
          200: {
            description: "Server welcome message",
          },
        },
      },
    },
    "/db-test": {
      get: {
        tags: ["Health"],
        summary: "Database connection test",
        responses: {
          200: {
            description: "Database connection is healthy",
          },
          500: {
            description: "Database connection error",
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a student account",
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login for student/admin/organizer",
      },
    },
    "/api/events": {
      get: {
        tags: ["Events"],
        summary: "List all events",
      },
    },
    "/api/dashboard/events": {
      get: {
        tags: ["Dashboard"],
        summary: "Get dashboard events for current user",
      },
    },
    "/api/logistics/assets": {
      get: {
        tags: ["Logistics"],
        summary: "List logistics assets",
      },
    },
    "/api/president/applications": {
      get: {
        tags: ["President"],
        summary: "List president applications",
      },
    },
    "/api/president/vendors": {
      get: {
        tags: ["Vendor"],
        summary: "List all vendors",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Vendors fetched successfully",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - CLUB_PRESIDENT role required",
          },
        },
      },
      post: {
        tags: ["Vendor"],
        summary: "Create a vendor",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "phone", "email", "stallId", "fee", "profit"],
                properties: {
                  name: { type: "string", example: "Snack Hub" },
                  phone: { type: "string", example: "0771234567" },
                  email: { type: "string", example: "snackhub@gmail.com" },
                  stallId: { type: "string", example: "S-12" },
                  fee: { type: "number", example: 25000 },
                  profit: { type: "number", example: 9000 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Vendor created successfully",
          },
          400: {
            description: "Validation error",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - CLUB_PRESIDENT role required",
          },
          409: {
            description: "Duplicate email or stallId",
          },
        },
      },
    },
    "/api/president/vendors/{id}": {
      get: {
        tags: ["Vendor"],
        summary: "Get vendor by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Vendor fetched successfully",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - CLUB_PRESIDENT role required",
          },
          404: {
            description: "Vendor not found",
          },
        },
      },
      put: {
        tags: ["Vendor"],
        summary: "Update vendor by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Snack Hub Updated" },
                  phone: { type: "string", example: "0777654321" },
                  email: { type: "string", example: "snackhub.updated@gmail.com" },
                  stallId: { type: "string", example: "S-14" },
                  fee: { type: "number", example: 27000 },
                  profit: { type: "number", example: 11000 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Vendor updated successfully",
          },
          400: {
            description: "Validation error",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - CLUB_PRESIDENT role required",
          },
          404: {
            description: "Vendor not found",
          },
          409: {
            description: "Duplicate email or stallId",
          },
        },
      },
      delete: {
        tags: ["Vendor"],
        summary: "Delete vendor by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Vendor deleted successfully",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - CLUB_PRESIDENT role required",
          },
          404: {
            description: "Vendor not found",
          },
        },
      },
    },
    "/api/president/sponsorships": {
      get: {
        tags: ["Sponsorship"],
        summary: "List all sponsorships",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Sponsorships fetched successfully" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - CLUB_PRESIDENT role required" },
        },
      },
      post: {
        tags: ["Sponsorship"],
        summary: "Create a sponsorship",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "amount", "eventName", "contact", "date"],
                properties: {
                  name: { type: "string", example: "Dialog Axiata PLC" },
                  amount: { type: "number", example: 500000 },
                  eventName: { type: "string", example: "Colombo Food Festival 2026" },
                  contact: { type: "string", example: "+94 77 100 2000" },
                  date: { type: "string", format: "date", example: "2026-02-15" },
                  remark: { type: "string", example: "Main partner" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Sponsorship created successfully" },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - CLUB_PRESIDENT role required" },
        },
      },
    },
    "/api/president/sponsorships/{id}": {
      get: {
        tags: ["Sponsorship"],
        summary: "Get sponsorship by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Sponsorship fetched successfully" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - CLUB_PRESIDENT role required" },
          404: { description: "Sponsorship not found" },
        },
      },
      put: {
        tags: ["Sponsorship"],
        summary: "Update sponsorship by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Dialog Axiata PLC" },
                  amount: { type: "number", example: 550000 },
                  eventName: { type: "string", example: "Tech Expo 2026" },
                  contact: { type: "string", example: "+94 77 200 3000" },
                  date: { type: "string", format: "date", example: "2026-03-10" },
                  remark: { type: "string", example: "Updated contract" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Sponsorship updated successfully" },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - CLUB_PRESIDENT role required" },
          404: { description: "Sponsorship not found" },
        },
      },
      delete: {
        tags: ["Sponsorship"],
        summary: "Delete sponsorship by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Sponsorship deleted successfully" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - CLUB_PRESIDENT role required" },
          404: { description: "Sponsorship not found" },
        },
      },
    },
  },
};

export default swaggerDocument;
