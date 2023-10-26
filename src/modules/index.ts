/* eslint-disable prettier/prettier */
import { UserModule } from './user/user.module';
import { DepartmentModule } from './department/department.module';
import { BranchModule } from './branch/branch.module';
//entities
import { Department } from './department/entities/department.entity';
import { Admin } from 'src/modules/user/entities/admin.entity';
import { Branch } from './branch/entities/branch.entity';
import { Telebot } from './telebot/entities/telebot.entity';
import { Message } from './message/entities/message.entity';
import { Service } from './service/entities/service.entity';
import { UserService as UserServiceEntity } from './user-service/entities/user-service.entity';
export {
    BranchModule,
    DepartmentModule,
    UserModule
}
export {
    Branch,
    Admin,
    Department,
    Telebot,
    Message,
    Service,
    UserServiceEntity
}