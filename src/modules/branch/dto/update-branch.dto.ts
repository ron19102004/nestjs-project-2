import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchDto } from './create-branch.dto';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  name: string;
  email: string;
  hotline: string;
  src_map: string;
  description: string;
  address: string;
  id: number;
  established_at: Date;
}
