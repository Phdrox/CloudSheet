import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { UsersService } from './users/users.services.js';
import { FlowsServices } from './flows/flows.services.js';
import { FlowsController } from './flows/flows.controllers.js';
import { GoalServices } from './goal/goal.services.js';
import { CategoriesServices } from './categories/categories.services.js';
import { GoalController } from './goal/goal.controllers.js';
import { CategoryController } from './categories/categories.controllers.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller.js';
import { auth } from './auth.js';
import { UserController } from './users/user.controllers.js';

@Module({
  imports: [ConfigModule.forRoot(),AuthModule.forRoot({auth})],
  controllers: [AppController,FlowsController,GoalController,CategoryController,UserController],
  providers: [UsersService,FlowsServices,GoalServices,CategoriesServices]
})
export class AppModule {}
