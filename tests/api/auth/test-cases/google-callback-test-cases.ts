import { configuration } from "../../../../src/config/configuration";
import { ApiTestCase } from "../../../../src/helpers/types/api-test-case";

const method = "GET";
const apiPath = "/api/Auth/google-callback";

const state = configuration.googleAuthCallback;
const code = configuration.googleAuthCode;

const prepareCallbackPath = (state?: string, code?: string) => {
  const params = [];
  if (state) params.push(`state=${state}`);
  if (code) params.push(`code=${code}`);

  if (params.length === 0) {
    return apiPath;
  }
  return `${apiPath}?${params.join("&")}`;
};

export const googleCallbackTestCases: ApiTestCase[] = [
  {
    testCaseId: "TC-AUTH-GOOGLE-001",
    testCaseDescription: "valid authentication via Google callback",
    requestPath: prepareCallbackPath(state, code),
    method,
    isAuthorized: false,
    expectedStatus: 307,
  },
  {
    testCaseId: "TC-AUTH-GOOGLE-002",
    testCaseDescription: "invalid state parameter",
    requestPath: prepareCallbackPath("invalid_state", code),
    method,
    isAuthorized: false,
    expectedStatus: 307,
  },
  {
    testCaseId: "TC-AUTH-GOOGLE-003",
    testCaseDescription: "missing state parameter",
    requestPath: prepareCallbackPath(undefined, code),
    method,
    isAuthorized: false,
    expectedStatus: 307,
  },
  {
    testCaseId: "TC-AUTH-GOOGLE-004",
    testCaseDescription: "invalid code parameter",
    requestPath: prepareCallbackPath(state, "invalid_code"),
    method,
    isAuthorized: false,
    expectedStatus: 307,
  },
  {
    testCaseId: "TC-AUTH-GOOGLE-005",
    testCaseDescription: "missing code parameter",
    requestPath: prepareCallbackPath(state, undefined),
    method,
    isAuthorized: false,
    expectedStatus: 307,
  },
  {
    testCaseId: "TC-AUTH-GOOGLE-005",
    testCaseDescription: "missing code and state parameters",
    requestPath: prepareCallbackPath(undefined, undefined),
    method,
    isAuthorized: false,
    expectedStatus: 500,
  },
];
