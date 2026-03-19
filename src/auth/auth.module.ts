import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstantKey } from './constant.js';

@Module({
  imports:[UsersModule,JwtModule.register({
    global:true,
    secret:jwtConstantKey.secret,
    signOptions:{expiresIn:`${60}s`}
  })],
  providers: [AuthService],
  exports:[AuthService]
})
export class AuthModule {}
