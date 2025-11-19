import { test } from "@playwright/test";

import { runApiTestCases } from "../../../src/helpers/run-api-test-cases";
import { updateTodoTestCases } from "./test-cases/update-todo-test-cases";
import { removeTodoById } from "../../../src/helpers/remove-todo-by-id";
import { randomUUID } from "crypto";
import { createInitialTodoWithId } from "../../../src/helpers/create-initial-todo-with-id";

const todoTestId = randomUUID();

test.describe("update Todos", () => {
  test.beforeEach(async ({ request }) => {
    await removeTodoById(request, todoTestId);
    await createInitialTodoWithId(request, todoTestId);
  });

  test.afterEach(async ({ request }) => {
    await removeTodoById(request, todoTestId);
  });

  runApiTestCases(updateTodoTestCases(todoTestId));
});
