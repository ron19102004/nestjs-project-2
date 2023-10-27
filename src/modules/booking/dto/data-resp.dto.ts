/* eslint-disable prettier/prettier */
import { Service } from 'src/modules/service/entities/service.entity';

export interface IDataBookingDto {
  service: Service;
  admin: any;
  user: any;
  note: string;
  finished: boolean;
  finished_at: Date;
  accepted: boolean;
  rejected: boolean;
}
