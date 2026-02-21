import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { UsersService } from './users/users.services';
import { UserController } from './users/users.controllers';
import { FlowsServices } from './flows/flows.services';
import { FlowsController } from './flows/flows.controllers';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UserController,FlowsController],
  providers: [UsersService,FlowsServices],
})
export class AppModule {}
