import { nonExistingTodoId } from "../../../../src/helpers/constants";
import { ApiTestCase } from "../../../../src/helpers/types/api-test-case";

const method = "PUT";

export const updateTodoTestCases = (todoTestId: string): ApiTestCase[] => {
  const requestPath = `/api/Todos/${todoTestId}`;

  return [
    {
      testCaseId: "TC-UPDATE-001",
      testCaseDescription: "updates existing todo with valid data",
      requestPath,
      method,
      payload: { title: "Test title" },
      expectedStatus: 204,
    },
    {
      testCaseId: "TC-UPDATE-002",
      testCaseDescription: "negative: empty title",
      requestPath,
      method,
      payload: { title: "" },
      expectedStatus: 400,
      expectedErrorMessage: "title",
    },
    {
      testCaseId: "TC-UPDATE-003",
      testCaseDescription: "negative: missing id triggers validation error",
      requestPath: "/api/Todos/",
      method,
      payload: { description: "No id here" },
      expectedStatus: 405,
    },
    {
      testCaseId: "TC-UPDATE-004",
      testCaseDescription: "negative: title too long (>200 chars)",
      requestPath,
      method,
      payload: { title: "x".repeat(201) },
      expectedStatus: 500,
    },
    {
      testCaseId: "TC-UPDATE-005",
      testCaseDescription: "negative: non-existing id",
      requestPath: `/api/Todos/${nonExistingTodoId}`,
      method,
      payload: { title: "Unrelated title" },
      expectedStatus: 404,
    },
    //   {
    //     testCaseId: "TC-UPDATE-006",
    //     testCaseDescription: "negative: id of another user",
    //     requestPath: `/api/Todos/${}`,
    //     method,
    //     payload: { title: "Unrelated title" },
    //     expectedStatus: 404,
    //   },

    //   //TODO -> Move to separate test, to check that we don't create extra fields. or add expectedResult field
    // {
    //   testCaseId: "TC-UPDATE-007",
    //   testCaseDescription: "negative: unexpected field in payload",
    //   requestPath,
    //   method,
    //   payload: { title: "Unrelated title", unexpectedField: "any value" },
    //   expectedStatus: 400,
    // },
    {
      testCaseId: "TC-UPDATE-008",
      testCaseDescription: "negative: id uuid is invalid format",
      requestPath: "/api/Todos/invalid-uuid-format",
      method,
      payload: { title: "Unrelated title" },
      expectedStatus: 400,
    },
    //   //TODO -> Move to separate test, to check that we update date correctly. or add expectedResult field
    {
      testCaseId: "TC-UPDATE-009",
      testCaseDescription: "negative: unexpected field type in payload",
      requestPath,
      method,
      payload: { title: 12345 },
      expectedStatus: 400,
    },
    {
      testCaseId: "TC-UPDATE-010",
      testCaseDescription:
        "negative: unauthorized update of existing todo with valid data",
      requestPath,
      method,
      payload: { title: "Test title" },
      expectedStatus: 401,
      isAuthorized: false,
    },
    {
      testCaseId: "TC-UPDATE-011",
      testCaseDescription: "negative: unauthorized update of non-existing id",
      requestPath: `/api/Todos/${nonExistingTodoId}`,
      method,
      payload: { title: "Unrelated title" },
      isAuthorized: false,
      expectedStatus: 401,
    },
  ];
};
