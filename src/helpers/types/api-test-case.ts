import { HttpMethod } from "./http-method";

export type ApiTestCase = {
  testCaseId: string;
  testCaseDescription: string;
  requestPath: string;
  method: HttpMethod;
  payload?: Record<string, unknown>;
  expectedStatus: number;
  expectedErrorMessage?: string;
  isAuthorized?: boolean;
};
