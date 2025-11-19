import { nonExistingTodoId } from "../../../../src/helpers/constants";
import { ApiTestCase } from "../../../../src/helpers/types/api-test-case";

const method = "GET";

export const readTodoTestCases = (todoTestId: string): ApiTestCase[] => {
  const requestPath = `/api/Todos/${todoTestId}`;

  return [
    {
      testCaseId: "TC-READ-001",
      testCaseDescription: "read existing todo",
      requestPath,
      method,
      expectedStatus: 200,
    },
    {
      testCaseId: "TC-READ-002",
      testCaseDescription: "negative: read non-existing todo",
      requestPath: `/api/Todos/${nonExistingTodoId}`,
      method,
      expectedStatus: 404,
    },
    {
      testCaseId: "TC-READ-003",
      testCaseDescription: "negative: read todo with non-valid uuid format",
      requestPath: `/api/Todos/non-valid-uuid`,
      method,
      expectedStatus: 400,
    },
    {
      testCaseId: "TC-READ-004",
      testCaseDescription: "negative: unauthorized read of an existing todo",
      requestPath,
      method,
      expectedStatus: 401,
      isAuthorized: false,
    },
    {
      testCaseId: "TC-READ-005",
      testCaseDescription: "negative: unauthorized read of a non-existing todo",
      requestPath: `/api/Todos/${nonExistingTodoId}`,
      method,
      expectedStatus: 401,
      isAuthorized: false,
    },
  ];
};
