/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);    
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const jwtConfigs = this.configService.get<{
        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;
      }>('JWT');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConfigs.ACCESS_TOKEN_SECRET,
      });      
      request['payload'] = payload;
    } catch (error: any) {      
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
