import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UserController } from './user.controller.js';

@Module({
  providers: [UsersService],
  exports:[UsersService],
  controllers:[UserController]
})
export class UsersModule {}
