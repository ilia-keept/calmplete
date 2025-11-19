import { APIRequestContext, APIResponse } from "@playwright/test";
import { configuration } from "../config/configuration";
import { HttpMethod } from "./types/http-method";

export const performRequest = ({
  request,
  method,
  path,
  payload,
  isAuthorized = true,
}: {
  request: APIRequestContext;
  method: HttpMethod;
  path: string;
  payload?: Record<string, unknown>;
  isAuthorized?: boolean;
}): Promise<APIResponse> => {
  const options: Record<string, any> = payload
    ? { data: payload, maxRedirects: 0 }
    : { maxRedirects: 0 };

  if (isAuthorized) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${configuration.appBearerToken}`,
    };
  }

  switch (method) {
    case "GET":
      return request.get(path, options);
    case "POST":
      return request.post(path, options);
    case "PUT":
      return request.put(path, options);
    case "DELETE":
      return request.delete(path, options);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};
