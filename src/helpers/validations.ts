import { z } from "zod"

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
  picKey: z.string().optional(),
  picUrl: z.string().optional(),
})

export type UserRegisterationType = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
