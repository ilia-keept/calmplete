import { nonExistingTodoId } from "../../../../src/helpers/constants";
import { ApiTestCase } from "../../../../src/helpers/types/api-test-case";

const apiPath = "/api/Todos";
const method = "DELETE";

export const deleteTodoTestCases = (todoTestId: string): ApiTestCase[] => [
  {
    testCaseId: "TC-DELETE-001",
    testCaseDescription: "delete existing todo with valid data",
    requestPath: `${apiPath}/${todoTestId}`,
    method,
    expectedStatus: 204,
  },
  {
    testCaseId: "TC-DELETE-002",
    testCaseDescription: "negative: delete non-existing todo",
    requestPath: `${apiPath}/${nonExistingTodoId}`,
    method,
    expectedStatus: 404,
  },
  {
    testCaseId: "TC-DELETE-003",
    testCaseDescription: "negative: delete todo with non-valid uuid format",
    requestPath: `${apiPath}/non-valid-uuid`,
    method,
    expectedStatus: 400,
  },

  {
    testCaseId: "TC-DELETE-004",
    testCaseDescription: "negative: missing id in request path",
    requestPath: `${apiPath}/`,
    method,
    expectedStatus: 405,
  },

  {
    testCaseId: "TC-DELETE-005",
    testCaseDescription: "negative: unauthorized delete of a existing todo",
    requestPath: `${apiPath}/${todoTestId}`,
    method,
    expectedStatus: 401,
    isAuthorized: false,
  },

  {
    testCaseId: "TC-DELETE-006",
    testCaseDescription: "negative: unauthorized delete of a non-existing todo",
    requestPath: `${apiPath}/${nonExistingTodoId}`,
    method,
    expectedStatus: 401,
    isAuthorized: false,
  },
];
