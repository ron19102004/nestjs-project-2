/* eslint-disable prettier/prettier */
export interface IDataBookingDto {
  uService: any;
  admin: any;
  user: any;
  note: string;
  finished: boolean;
  finished_at: Date;
  accepted: boolean;
  rejected: boolean;
  created_at: Date;
  id:number,
  timeInit:string
}
export enum EAction {
  ACCEPT = "accept",
  REJECT = "reject",
  FINISH = "finish",
}