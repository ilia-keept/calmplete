import { test } from "@playwright/test";

import { runApiTestCases } from "../../../src/helpers/run-api-test-cases";
import { removeTodoById } from "../../../src/helpers/remove-todo-by-id";
import { randomUUID } from "crypto";
import { createInitialTodoWithId } from "../../../src/helpers/create-initial-todo-with-id";
import { readTodoTestCases } from "./test-cases/read-todo-test-cases";

const todoTestId = randomUUID();

test.describe("read Todos", () => {
  test.beforeEach(async ({ request }) => {
    await removeTodoById(request, todoTestId);
    await createInitialTodoWithId(request, todoTestId);
  });

  test.afterEach(async ({ request }) => {
    await removeTodoById(request, todoTestId);
  });

  runApiTestCases(readTodoTestCases(todoTestId));
});
