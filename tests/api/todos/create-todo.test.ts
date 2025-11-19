import { APIRequestContext, test, TestInfo } from "@playwright/test";
import { createTodoTestCases } from "./test-cases/create-todo-test-cases";
import { randomUUID } from "crypto";

import { runApiTestCases } from "../../../src/helpers/run-api-test-cases";
import { removeTodoById } from "../../../src/helpers/remove-todo-by-id";

const todoTestId = randomUUID();

test.describe("create Todos", () => {
  test.afterEach(
    async ({ request }) => await removeTodoById(request, todoTestId)
  );

  test.afterEach(
    //TODO: use testInfo with attached response to extract created todo id(s) for cleanup
    async ({ request }) => await removeTodoById(request, todoTestId)
  );

  runApiTestCases(createTodoTestCases(todoTestId));
});
