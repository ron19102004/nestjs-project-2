import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  name: string;
  description: string;
  duties: string;
  id: number;
  treatment_techniques: string;
  equipment_system: string;
}
