import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(context: ExecutionContext,): boolean{
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['x-api-token'];
    if (authHeader === this.configService.get('API_KEY')) {
      return true;
    }
    return false;    
  }
}
