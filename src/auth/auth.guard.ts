import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ROLES_KEY } from '../roles/roles.decorator.js';
import { IS_PUBLIC_KEY } from 'src/roles/public.decorator.js';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
      private jwtService: JwtService,
      private reflector: Reflector
    ){}

   async canActivate(context:ExecutionContext):Promise<boolean>{
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);

        if (isPublic) {
          return true;
        }

        const request=context.switchToHttp().getRequest<Request & { user?: any }>();
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
          ROLES_KEY,
          [context.getHandler(), context.getClass()],
        );

        const token= this.extractTokenFromHeader(request);

        if(!token){
            throw new UnauthorizedException();
        }

        try{
            const payload= await this.jwtService.verifyAsync(token,{secret:process.env.JWT_SECRET!});
            if (!payload ||payload.type !== 'access') {
              throw new UnauthorizedException('Tipo de token inválido para esta rota');
            }
            request['user']=payload;
            
            if (requiredRoles && requiredRoles.length > 0) {
              const userRole = payload.role;
              if (!requiredRoles.includes(userRole)) {
                throw new UnauthorizedException('Sem permissão');
              }
            }

        }catch{
            throw new UnauthorizedException();
        }

        return true;
   }

   private extractTokenFromHeader(request:Request): string | undefined{
     const cookieToken=request.cookies?.['access_token'];
     if(cookieToken) return cookieToken;

     const authorization=request.headers?.authorization;

     if(!authorization) return undefined;

     const [type,token]=authorization.split(' ') ?? [];
     
     return type === 'Bearer' ? token : undefined;
   }
}

