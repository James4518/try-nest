import { moment_picture } from "@prisma/client";

export interface IPicRes {
  isExisit: boolean,
  data?: Pick<moment_picture,'mimetype'|'size'|'location'>
}