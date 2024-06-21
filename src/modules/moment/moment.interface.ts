import { moment } from "@prisma/client";

interface author {id: number}
export type MomentsRes = Omit<moment, 'userId'> & author

export type MomentRes = moment & {imgList?:string[]}

export interface IMomentPic {
  filename: string;
  mimetype: string;
  size: number;
  location: string;
  tempLocation?: string; 
}