import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){}

   async canActivate(contest:ExecutionContext):Promise<boolean>{
        const request=contest.switchToHttp().getRequest<Request & { user?: any }>();
        const token= this.extractTokenFromHeader(request);

        if(!token){
            throw new UnauthorizedException();
        }

        try{
            const payload= await this.jwtService.verifyAsync(token,{secret:process.env.JWT_SECRET!});
            request['user']=payload;
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

