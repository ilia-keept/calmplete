import { test, expect, APIRequestContext } from "@playwright/test";
import { todoSchema } from "../../../src/validators/response";
import { z } from "zod";
import { randomUUID } from "crypto";
import { removeTodoById } from "../../../src/helpers/remove-todo-by-id";
import { successfulMutationStatus } from "../../../src/helpers/constants";
import { createInitialTodoWithId } from "../../../src/helpers/create-initial-todo-with-id";
import { performRequest } from "../../../src/helpers/perform-request";
import { ensureDefined } from "../../../src/helpers/ensure-defined";

test.describe("Todos CRUD Flow", () => {
  let currentTodoItem: z.infer<typeof todoSchema>;

  const todoTestId = randomUUID();

  const todoTestItem = {
    title: "Test Todo Item",
    description: `This is a test todo item with a specific ID: ${todoTestId}`,
    id: todoTestId,
  };

  test.beforeAll(async ({ request }) => {
    await removeTodoById(request, todoTestId);
  });

  test.afterAll(async ({ request }) => {
    await removeTodoById(request, currentTodoItem.id);
  });

  test("create, read, update, toggle, delete a todo and verify it is removed", async ({
    request,
  }) => {
    await test.step(`ensure that initial list of existing todos doesn't have todo with id ${todoTestId}`, async () => {
      await ensureTodoNotInList(request, todoTestId);
    });

    await test.step("create todo", async () => {
      const createResponse = await createInitialTodoWithId(
        request,
        todoTestId,
        todoTestItem
      );

      /**
       * TODO: Jira XX-1234
       * It is returning 200 by Swagger specs, but actually returns 204
       * Which is acceptable, but should be confirmed with the backend team
       */
      expect(createResponse.status()).toBe(successfulMutationStatus);
    });

    await test.step(`retrieve the created todo and verify its fields match the provided values`, async () => {
      currentTodoItem = ensureDefined(
        await getTodoById(request, todoTestId),
        "Todo not found"
      );

      expect(currentTodoItem).toMatchObject({
        title: todoTestItem.title,
        description: todoTestItem.description,
        id: todoTestItem.id,
      });
    });

    await test.step("update todo: update title", async () => {
      const updatePayload = {
        title: `${currentTodoItem.title} updated`,
      };

      const updateResponse = await performRequest({
        request,
        method: "PUT",
        path: `/api/Todos/${currentTodoItem.id}`,
        payload: updatePayload,
      });

      expect(updateResponse.status()).toBe(successfulMutationStatus);

      currentTodoItem = ensureDefined(
        await getTodoById(request, currentTodoItem.id),
        "Todo not found"
      );

      expect(currentTodoItem.title).toBe(updatePayload.title);
    });

    await test.step("update todo: toggle completion status", async () => {
      const isInitialTodoCompleted = currentTodoItem.isCompleted;

      const toggleResponse = await performRequest({
        request,
        method: "PUT",
        path: `/api/Todos/toggle/${currentTodoItem.id}`,
      });

      expect(toggleResponse.status()).toBe(successfulMutationStatus);

      currentTodoItem = ensureDefined(
        await getTodoById(request, currentTodoItem.id),
        "Todo not found"
      );

      expect(currentTodoItem.isCompleted).toBe(!isInitialTodoCompleted);
    });

    await test.step("delete todo and verify it is not longer retrievable", async () => {
      const deleteResponse = await performRequest({
        request,
        method: "DELETE",
        path: `/api/Todos/${currentTodoItem.id}`,
      });

      expect(deleteResponse.status()).toBe(successfulMutationStatus);
    });

    await test.step("verify the deleted todo is not retrievable by id", async () => {
      const notExistingTodo = await getTodoById(request, currentTodoItem.id);
      expect(notExistingTodo).toBeUndefined();
    });

    await test.step("verify the deleted todo is not presented in the todos list", async () => {
      await ensureTodoNotInList(request, currentTodoItem.id);
    });
  });
});

const getTodoById = async (request: APIRequestContext, todoId: string) => {
  const response = await performRequest({
    request,
    method: "GET",
    path: `/api/Todos/${todoId}`,
  });

  if (response.status() === 200) {
    return todoSchema.parse(await response.json());
  }

  return undefined;
};

const ensureTodoNotInList = async (
  request: APIRequestContext,
  todoId: string
) => {
  const listResponse = await performRequest({
    request,
    method: "GET",
    path: "/api/Todos",
  });

  expect(listResponse.status()).toBe(200);

  const todosList: z.infer<typeof todoSchema>[] = z
    .array(todoSchema)
    .parse(await listResponse.json());

  const todo = todosList.find((t) => t.id === todoId);
  expect(todo).toBeUndefined();
};
