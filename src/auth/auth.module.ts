import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config.js';

@Module({
  imports:[UsersModule,JwtModule.register({
    global:true,
    secret:process.env.JWT_SECRET!,
  })],
  providers: [AuthService],
  exports:[AuthService,JwtModule]
})
export class AuthModule {}
