import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../modules/auth/decorator/roles-auth.decorator";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService,
              private readonly reflector: Reflector,
              private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ])
      console.log('Required Roles:', requiredRoles);

      if (!requiredRoles) {
        return true;
      }
      const req = context.switchToHttp().getRequest()
      const authHeader = req.headers.authorization
      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
      }

      console.log(token);
      const user = await this.jwtService.verify(token);
      console.log(user);

      req.user = user


      return user.roles.some(role => requiredRoles.includes(role.value))
    } catch (error) {
      console.error('Error during token verification:', error);
      throw new UnauthorizedException({ message: 'Ошибка при верификации токена' });
    }
  }
}