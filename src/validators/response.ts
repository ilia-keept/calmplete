import { z } from "zod";

export const todoSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  isCompleted: z.boolean(),
  dueDate: z.iso.datetime().nullable(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});
