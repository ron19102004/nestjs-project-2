/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Admin } from 'src/modules';
import { Role } from 'src/modules/user/interfaces/enum';

export abstract class AuthsPayload {
  protected static INSTANCE: AuthsPayload;
  public static setInstance(instance: AuthsPayload): AuthsPayload {
    this.INSTANCE = instance;
    return this.INSTANCE;
  }
  abstract payload(user: Admin): any;
}
export class UserPayload extends AuthsPayload {
  public static getInstance(): UserPayload {
    return this.INSTANCE
      ? this.INSTANCE
      : AuthsPayload.setInstance(new UserPayload());
  }
  payload(user: Admin) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      sex: user.sex,
      phoneNumber: user.phoneNumber,
      email: user.email,
      age: user.age,
      role: user.role,
      avatar: user.avatar,
    };
  }
}
export class AdminPayload extends AuthsPayload {
  public static getInstance(): AdminPayload {
    return this.INSTANCE
      ? this.INSTANCE
      : AuthsPayload.setInstance(new AdminPayload());
  }
  payload(user: Admin) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      sex: user.sex,
      phoneNumber: user.phoneNumber,
      email: user.email,
      age: user.age,
      role: user.role,
      avatar: user.avatar,
      bio: user?.bio,
      branch: {
        name: user?.branch?.name,
        hotline: user?.branch?.hotline,
        id: user?.branch?.id,
      },
      department: {
        name: user?.department?.name,
        id: user?.department?.id,
      },
      position: user.position,
      member_of_organization: user.member_of_organization,
      areas_of_expertise: user.areas_of_expertise,
    };
  }
}
const AuthsPayloads: Record<string, AuthsPayload> = {};
AuthsPayloads[Role.user] = UserPayload.getInstance();
AuthsPayloads[Role.admin] = AdminPayload.getInstance();
AuthsPayloads[Role.master] = AuthsPayloads[Role.admin];
export { AuthsPayloads };
