import { test } from "@playwright/test";

import { runApiTestCases } from "../../../src/helpers/run-api-test-cases";
import { removeTodoById } from "../../../src/helpers/remove-todo-by-id";
import { deleteTodoTestCases } from "./test-cases/delete-todo-test-cases";
import { randomUUID } from "crypto";
import { createInitialTodoWithId } from "../../../src/helpers/create-initial-todo-with-id";

const todoTestId = randomUUID();

test.describe("delete Todos", () => {
  test.beforeEach(async ({ request }) => {
    await removeTodoById(request, todoTestId);
    await createInitialTodoWithId(request, todoTestId);
  });

  test.afterEach(
    async ({ request }) => await removeTodoById(request, todoTestId)
  );

  runApiTestCases(deleteTodoTestCases(todoTestId));
});
