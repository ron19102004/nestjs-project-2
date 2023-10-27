/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Admin } from 'src/modules';
import { Role } from 'src/modules/user/interfaces/enum';

export abstract class AuthsPayload {
  abstract payload(user: Admin): any;
}
export class UserPayload extends AuthsPayload {
  payload(user: Admin) {
    return {
      id:user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      sex: user.sex,
      phoneNumber: user.phoneNumber,
      email: user.email,
      age: user.age,
      role: user.role,
      avatar: user.avatar,
      refresh_token: user.refresh_token,
    };
  }
}
export class AdminPayload extends AuthsPayload {
  payload(user: Admin) {
    return {
      id:user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      sex: user.sex,
      phoneNumber: user.phoneNumber,
      email: user.email,
      age: user.age,
      role: user.role,
      avatar: user.avatar,
      refresh_token: user.refresh_token,
      bio: user?.bio,
      branch: {
        name: user?.branch?.name,
        hotline:user?.branch?.hotline,
        id: user?.branch?.id
      },
      department: {
        name: user?.department?.name,
        id: user?.department?.id
      },
      position: user.position,
      member_of_organization: user.member_of_organization,
      areas_of_expertise: user.areas_of_expertise,
    };
  }
}
const AuthsPayloads: Record<string, AuthsPayload> = {};
AuthsPayloads[Role.user] = new UserPayload();
AuthsPayloads[Role.admin] = new AdminPayload();
AuthsPayloads[Role.master] = AuthsPayloads[Role.admin];
export { AuthsPayloads };
