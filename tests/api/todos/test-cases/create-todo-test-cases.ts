import { ApiTestCase } from "../../../../src/helpers/types/api-test-case";

const requestPath = "/api/Todos";
const method = "POST";

export const createTodoTestCases = (todoTestId: string): ApiTestCase[] => [
  {
    testCaseId: "TC-CREATE-001",
    testCaseDescription: "valid todo – minimal fields",
    requestPath,
    method,
    payload: { title: "Test title", id: todoTestId },
    /**
     * TODO: Jira XX-1234
     * It is returning 200 by Swagger specs, but actually returns 204
     * Which is acceptable, but should be confirmed with the backend team
     */
    expectedStatus: 200,
  },
  {
    testCaseId: "TC-CREATE-002",
    testCaseDescription: "negative: missing title triggers validation error",
    requestPath,
    method,
    payload: { description: "No title here", id: todoTestId },
    expectedStatus: 400,
    expectedErrorMessage: "title",
  },
  {
    testCaseId: "TC-CREATE-003",
    testCaseDescription: "negative: title too long (>200 chars)",
    requestPath,
    method,
    payload: { title: "x".repeat(201), id: todoTestId },
    expectedStatus: 400,
    expectedErrorMessage: "maximum length of '200'",
  },
  {
    testCaseId: "TC-CREATE-004",
    testCaseDescription: "negative: empty title",
    requestPath,
    method,
    payload: { title: "" },
    expectedStatus: 400,
    expectedErrorMessage: "The Title field is required",
  },
  {
    testCaseId: "TC-CREATE-005",
    testCaseDescription: "valid todo – all fields",
    requestPath,
    method,
    payload: {
      title: "Test title",
      id: todoTestId,
      description: "Test description",
      isCompleted: false,
      dueDate: "2025-11-17T21:49:07.857Z",
      createdAt: "2025-11-17T21:49:07.857Z",
      updatedAt: "2025-11-17T21:49:07.857Z",
    },
    expectedStatus: 200,
  },
  {
    testCaseId: "TC-CREATE-006",
    testCaseDescription: "negative: missing all fields",
    requestPath,
    method,
    payload: {},
    expectedStatus: 400,
  },
  {
    testCaseId: "TC-CREATE-007",
    testCaseDescription:
      "negative: unauthorized -> valid todo – minimal fields",
    requestPath,
    method,
    payload: { title: "Test title", id: todoTestId },
    isAuthorized: false,
    expectedStatus: 401,
  },
  {
    testCaseId: "TC-CREATE-008",
    testCaseDescription: "negative: unauthorized -> missing all fields",
    requestPath,
    method,
    payload: {},
    isAuthorized: false,
    expectedStatus: 401,
  },
  {
    testCaseId: "TC-CREATE-009",
    testCaseDescription: "negative: unauthorized -> valid todo – all fields",
    requestPath,
    method,
    payload: {
      title: "Test title",
      id: todoTestId,
      description: "Test description",
      isCompleted: false,
      dueDate: "2025-11-17T21:49:07.857Z",
      createdAt: "2025-11-17T21:49:07.857Z",
      updatedAt: "2025-11-17T21:49:07.857Z",
    },
    isAuthorized: false,
    expectedStatus: 401,
  },
  {
    testCaseId: "TC-CREATE-010",
    testCaseDescription: "negative: invalid dueDate field format",
    requestPath,
    method,
    payload: {
      title: "Test title",
      id: todoTestId,
      dueDate: "not-a-date",
    },
    expectedStatus: 400,
  },
  {
    testCaseId: "TC-CREATE-011",
    testCaseDescription: "not fail if receive unexpected field",
    requestPath,
    method,
    payload: {
      title: "Test title",
      id: todoTestId,
      unexpectedField: "unexpected",
    },
    expectedStatus: 200,
  },
  {
    testCaseId: "TC-CREATE-012",
    testCaseDescription: "negative: null title",
    requestPath,
    method,
    payload: {
      title: null,
      id: todoTestId,
    },
    expectedStatus: 400,
    expectedErrorMessage: "The Title field is required",
  },
];
