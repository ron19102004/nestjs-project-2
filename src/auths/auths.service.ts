/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import {
  SignInStrategys,
} from './gateways/auths-signIn.gateway';
import { IResObj, ResponseCustomModule } from 'src/helpers/response.help';
import { AuthsPayloads } from './gateways/auths-payload.gateway';
import { Admin } from 'src/modules';
import { ConfigService } from '@nestjs/config';
import { TelebotService } from 'src/modules/telebot/telebot.service';

@Injectable()
export class AuthsService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private telebotService: TelebotService,
  ) {}
  public getUserService(){
    return this.userService
  }
  async signIn(signInDto: SignInDto) {
    const login: IResObj<{ user: Admin; deviceName: string | null }> =
      await SignInStrategys[signInDto.login_method].login(
        signInDto,
        this.userService,
      );
    if (!login.success) return login;
    const user: Admin = login.data.user as Admin;
    const tele_id: number = parseInt(user.teleID || '') ?? 0;
    const deviceName: string =
      login.data.deviceName && login.data.deviceName.length > 0
        ? `trên thiết bị ${login.data.deviceName}`
        : '';
    this.telebotService.getTelebotGateway().sendMessage({
      id: tele_id,
      message: `🔔Thông báo🔔\n⚠️Tài khoản của bạn vừa được đăng nhập vào web ${deviceName} vào lúc ${new Date()}`,
      userReceive: user,
      userSend: null,
    });

    const jwtConfigs = this.configService.get<{
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
    }>('JWT');
    const payload = AuthsPayloads[user.role].payload(user);
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '2h',
      algorithm: 'HS256',
      secret: jwtConfigs.ACCESS_TOKEN_SECRET,
    });
    let refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '2h',
      algorithm: 'HS256',
      secret: jwtConfigs.REFRESH_TOKEN_SECRET,
    });
    if (!user.refresh_token || user.refresh_token.length === 0) {
      user.refresh_token = refresh_token;
      await this.userService.save(user);
    } else refresh_token = user.refresh_token;
    return ResponseCustomModule.ok(
      {
        access_token: access_token,
        refresh_token: refresh_token,
      },
      'Login successful',
    );
  }
}
