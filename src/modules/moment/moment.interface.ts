import { moment } from "@prisma/client";

interface author {id: number}

export type MomentRes = Omit<moment, 'userId'> & author