import { APIRequestContext } from "@playwright/test";
import { performRequest } from "./perform-request";

export const createInitialTodoWithId = async (
  request: APIRequestContext,
  todoTestId: string,
  payload?: Record<string, unknown>
) =>
  await performRequest({
    request,
    method: "POST",
    path: "/api/Todos",
    payload: {
      title: "Initial Todo for Tests",
      id: todoTestId,
      ...payload,
    },
  });
