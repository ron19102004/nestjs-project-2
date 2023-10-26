/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from '..';
import { Repository } from 'typeorm';
import { ResponseCustomModule } from 'src/helpers/response.help';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch) private repository: Repository<Branch>,
  ) {}
  async create(createBranchDto: CreateBranchDto) {
    const branch: Branch = await this.repository.save(createBranchDto);
    return ResponseCustomModule.ok(branch, 'Thêm nhánh thành công');
  }
  async findById(id: number) {
    return await this.repository.findOne({
      where: {
        id: id,
        deleted: false,
      },
    });
  }
}
