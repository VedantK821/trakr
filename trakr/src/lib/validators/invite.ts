import { z } from "zod";

export const createInviteSchema = z.object({
  email: z.string().email("Must be a valid email"),
  role: z.enum(["admin", "pm", "dev", "viewer"], {
    error: "Invalid role",
  }),
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;
