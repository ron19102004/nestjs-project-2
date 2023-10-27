/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/auths/decorators/public.decorator';
import { ROLES_KEY } from 'src/auths/decorators/role.decorator';
import { Role } from 'src/modules/user/interfaces/enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return true;
      }
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const payload = request.payload || null;
    if(!payload) return false;
    if (!requiredRoles) {
      return true;
    }    
    return requiredRoles.some((role) => payload.role === role);
  }
}