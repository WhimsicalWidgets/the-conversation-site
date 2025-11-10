import { z } from "zod";

export const conversationTitleSchema = z
  .string()
  .trim()
  .min(1, "Title cannot be empty")
  .max(200, "Title cannot exceed 200 characters");

export type ConversationTitleData = z.infer<typeof conversationTitleSchema>;
