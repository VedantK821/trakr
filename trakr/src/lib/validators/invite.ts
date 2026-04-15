import { z } from "zod";

export const createInviteSchema = z.object({
  email: z.string().email("Must be a valid email"),
  role: z.enum(["admin", "pm", "dev", "viewer"], {
    errorMap: () => ({ message: "Invalid role" }),
  }),
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;
