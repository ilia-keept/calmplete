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

  test("create → get → update → toggle → delete → verify deletion of todo", async ({
    request,
  }) => {
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

    await test.step("update todo: title", async () => {
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

      expect(currentTodoItem).toBeDefined();
      expect(currentTodoItem.title).toBe(updatePayload.title);
    });

    await test.step("update todo: is completed toggle", async () => {
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

      expect(currentTodoItem).toBeDefined();
      expect(currentTodoItem.isCompleted).toBe(!isInitialTodoCompleted);
    });

    await test.step("delete todo and verify deletion", async () => {
      const deleteResponse = await performRequest({
        request,
        method: "DELETE",
        path: `/api/Todos/${currentTodoItem.id}`,
      });

      expect(deleteResponse.status()).toBe(successfulMutationStatus);

      const notExistingTodo = await getTodoById(request, currentTodoItem.id);
      expect(notExistingTodo).toBeUndefined();
    });

    await test.step("check deleted todo is not returned at list of all todos", async () => {
      const listResponse = await performRequest({
        request,
        method: "GET",
        path: "/api/Todos",
      });

      expect(listResponse.status()).toBe(200);

      const todosList: z.infer<typeof todoSchema>[] = z
        .array(todoSchema)
        .parse(await listResponse.json());

      const deletedTodo = todosList.find(
        (todo) => todo.id === currentTodoItem.id
      );
      expect(deletedTodo).toBeUndefined();
    });
  });
});

const getTodoById = async (request: APIRequestContext, id: string) => {
  const response = await performRequest({
    request,
    method: "GET",
    path: `/api/Todos/${id}`,
  });

  if (response.status() === 200) {
    return todoSchema.parse(await response.json());
  }

  return undefined;
};
