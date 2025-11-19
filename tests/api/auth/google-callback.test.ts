import test from "@playwright/test";
import { runApiTestCases } from "../../../src/helpers/run-api-test-cases";
import { googleCallbackTestCases } from "./test-cases/google-callback-test-cases";

test.describe("check Google Auth", () => {
  runApiTestCases(googleCallbackTestCases);
});
