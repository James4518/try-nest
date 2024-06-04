import * as z from 'zod';
import {
  NAME_REGEX,
  PASSWORD_REGEX,
  NAME_OR_PASSWORD_IS_REQUIRED,
  NAME_LENGTH,
  NAME_IS_LIMITED,
  PASSWORD_LENGTH,
  PASSWORD_IS_LIMITED,
  NO_CONFRIMPASSWORD,
  WRONG_CONFRIMPASSWORD,
} from "@/common/constants";

export const createUserSchema = z.object({
  name: z.string().max(10, NAME_LENGTH).regex(NAME_REGEX, NAME_IS_LIMITED)
  .refine(value => value.trim().length > 0, {
    message: NAME_OR_PASSWORD_IS_REQUIRED
  }),
  password: z.string().min(6, PASSWORD_LENGTH).regex(PASSWORD_REGEX, PASSWORD_IS_LIMITED)
  .refine(value => value.trim().length > 0, {
    message: NAME_OR_PASSWORD_IS_REQUIRED
  }),
  confirmPassword: z.string()
  .refine(value => value.trim().length > 0, {
    message: NO_CONFRIMPASSWORD
  }),
}).required()
.refine((data) => data.password === data.confirmPassword, {
  message: WRONG_CONFRIMPASSWORD,
  path: ["confirmPassword"], 
})

export type SignUpDto = z.infer<typeof createUserSchema>