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
  async findAll() {
    return await this.repository.find({
      where: {
        deleted: false,
      },
    });
  }
  async update(updateBranchDto: UpdateBranchDto) {
    const branch: Branch = await this.repository.findOne({
      where: {
        deleted: false,
        id: updateBranchDto?.id,
      },
    });
    branch.name = updateBranchDto.name;
    branch.hotline = updateBranchDto.hotline;
    branch.description = updateBranchDto.description;
    branch.email = updateBranchDto.email;
    branch.src_map = updateBranchDto.src_map;
    branch.establish_at = updateBranchDto.established_at;
    branch.address = updateBranchDto.address;
    await this.repository.save(branch);
  }
  async delete(id: number) {
    const branch: Branch = await this.repository.findOne({
      where: {
        deleted: false,
        id: id,
      },
    });
    branch.deleted = true;
    await this.repository.save(branch);
  }
}
