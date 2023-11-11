/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IResObj, ResponseCustomModule } from 'src/helpers/response.help';
import { SignInDto } from '../dto/sign-in.dto';
import { UserService } from 'src/modules/user/user.service';
import { ValidatorCustomModule } from 'src/helpers/validator.help';
import { Admin } from 'src/modules';
import { HashCustomeModule } from 'src/helpers/hash.help';

export abstract class SignInStrategy {
  protected static INSTANCE: SignInStrategy;
  public static setInstance(instance: SignInStrategy): SignInStrategy {
    this.INSTANCE = instance;
    return this.INSTANCE;
  }
  abstract login(
    signInDto: SignInDto,
    userService: UserService,
  ): Promise<IResObj<{ user: Admin; deviceName: string | null }>>;
}
export class SignInByEmailStrategy extends SignInStrategy {
  public static getInstance(): SignInByEmailStrategy {
    return this.INSTANCE
      ? this.INSTANCE
      : SignInStrategy.setInstance(new SignInByEmailStrategy());
  }
  async login(
    signInDto: SignInDto,
    userService: UserService,
  ): Promise<IResObj<{ user: Admin; deviceName: string | null }>> {
    if (!ValidatorCustomModule.isEmail(signInDto.data_login_first.trim()))
      return ResponseCustomModule.error('Email is not valid', 400);
    const user: Admin = await userService.findByEmail(
      signInDto.data_login_first.trim(),
    );
    if (!user) return ResponseCustomModule.error('User Not Found', 404);
    if (!HashCustomeModule.compare(signInDto.password, user.password))
      return ResponseCustomModule.error('Password is not valid', 400);
    return ResponseCustomModule.ok(
      { user: user, deviceName: signInDto.deviceName },
      'Login successful',
    );
  }
}
export class SignInByPhoneNumberStrategy extends SignInStrategy {
  public static getInstance(): SignInByPhoneNumberStrategy {
    return this.INSTANCE
      ? this.INSTANCE
      : SignInStrategy.setInstance(new SignInByPhoneNumberStrategy());
  }
  async login(
    signInDto: SignInDto,
    userService: UserService,
  ): Promise<IResObj<{ user: Admin; deviceName: string | null }>> {
    if (!ValidatorCustomModule.isPhoneNumber(signInDto.data_login_first.trim()))
      return ResponseCustomModule.error('Email is not valid', 400);
    const user: Admin = await userService.findByPhoneNumber(
      signInDto.data_login_first.trim(),
    );
    if (!user) return ResponseCustomModule.error('User Not Found', 404);
    if (!HashCustomeModule.compare(signInDto.password, user.password))
      return ResponseCustomModule.error('Password is not valid', 400);
    return ResponseCustomModule.ok(
      { user: user, deviceName: signInDto.deviceName },
      'Login successful',
    );
  }
}
export enum LOGIN_METHOD {
  phone = 'PHONE_NUMBER',
  email = 'EMAIL',
}
//registation record for login methods
const SignInStrategys: Record<string, SignInStrategy> = {};
SignInStrategys[LOGIN_METHOD.phone] = SignInByPhoneNumberStrategy.getInstance();
SignInStrategys[LOGIN_METHOD.email] = SignInByEmailStrategy.getInstance();
export { SignInStrategys };
