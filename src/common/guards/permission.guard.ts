import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../services/permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { id: userId } = request.user;
    const keyName = Object.keys(request.params)[0];
    const resourceId = parseInt(request.params[keyName]);
    const resourceName = keyName.replace("Id", "");
    const isPermission = await this.permissionService.checkResource(resourceName, resourceId, userId);
    if (!isPermission) throw new ForbiddenException('OPERATION_IS_NOT_ALLOWED');
    return true;
  }
}
