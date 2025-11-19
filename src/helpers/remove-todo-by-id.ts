import { APIRequestContext } from "@playwright/test";
import { successfulMutationStatus } from "./constants";
import { performRequest } from "./perform-request";

export const removeTodoById = async (
  request: APIRequestContext,
  id: string
) => {
  //TODO: add retry on 500

  const response = await performRequest({
    request,
    method: "DELETE",
    path: `/api/Todos/${id}`,
  });

  if (![404, successfulMutationStatus].includes(response.status())) {
    throw new Error(
      `Failed to delete Todo ${id}. Status ${response.status()}, body: ${await response.text()}`
    );
  }
};
