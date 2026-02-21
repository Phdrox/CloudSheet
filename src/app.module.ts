import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { UsersService } from './users/users.services';
import { UserController } from './users/users.controllers';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [UsersService],
})
export class AppModule {}
