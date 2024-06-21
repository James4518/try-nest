import { moment_picture } from "@prisma/client";

export interface IPicRes {
  isExisit: boolean,
  data?: Omit<moment_picture,'id'|'userId'>
}