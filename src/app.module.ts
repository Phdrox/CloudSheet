import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { UsersService } from './users/users.service.js';
import { FlowsServices } from './flows/flows.service.js';
import { FlowsController } from './flows/flows.controller.js';
import { GoalServices } from './goal/goal.service.js';
import { CategoriesServices } from './categories/categories.service.js';
import { GoalController } from './goal/goal.controller.js';
import { CategoryController } from './categories/categories.controller.js';
import { AppController } from './app.controller.js';
import { UserController } from './users/user.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule,],
  controllers: [AppController,FlowsController,GoalController,CategoryController,UserController],
  providers: [UsersService,FlowsServices,GoalServices,CategoriesServices]
})
export class AppModule {}
