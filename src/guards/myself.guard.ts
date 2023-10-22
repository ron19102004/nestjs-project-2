/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class MyselfGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const payload = request.payload || null;
    const id = request.params.id || null;
    if (!payload || !id) return false;
    if (id !== payload.id) return false;
    return true;
  }
}
