import { test, expect, APIRequestContext, APIResponse } from "@playwright/test";
import type { ApiTestCase } from "./types/api-test-case";
import { performRequest } from "./perform-request";

export const runApiTestCases = (testCases: ApiTestCase[]) => {
  for (const testCase of testCases) {
    test(`[${testCase.testCaseId}]: ${testCase.testCaseDescription}`, async ({
      request,
    }, testInfo) => {
      /**
       * Save test case data as attachment for easier cleanup later
       */
      //   testInfo.attachments.push({
      //     name: "test-case",
      //     contentType: "application/json",
      //     body: Buffer.from(JSON.stringify(testCase)),
      //   });

      const response = await performRequest({
        request,
        method: testCase.method,
        path: testCase.requestPath,
        payload: testCase.payload,
        isAuthorized: testCase.isAuthorized,
      });

      /**
       * Save test result data as attachment for easier cleanup later
       */
      //   testInfo.attachments.push({
      //     name: "test-response",
      //     contentType: "application/json",
      //     body: Buffer.from(JSON.stringify(response)),
      //   });

      const expectedStatuses = Array.isArray(testCase.expectedStatus)
        ? testCase.expectedStatus
        : [testCase.expectedStatus];

      const responseStatus = response.status();

      expect(
        expectedStatuses.includes(responseStatus),
        `Received HTTP status ${responseStatus}, which is not in the expected set:[${expectedStatuses.join(
          ", "
        )}]`
      ).toBeTruthy();

      if (testCase.expectedErrorMessage) {
        const body = await response.json();
        expect(JSON.stringify(body)).toContain(testCase.expectedErrorMessage);
      }
    });
  }
};
