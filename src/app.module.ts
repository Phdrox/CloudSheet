import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { UsersService } from './users/users.services';
import { UserController } from './users/users.controllers';
import { FlowsServices } from './flows/flows.services';
import { FlowsController } from './flows/flows.controllers';
import { GoalServices } from './goal/goal.services';
import { CategoriesServices } from './categories/categories.services';
import { GoalController } from './goal/goal.controllers';
import { CategoryController } from './categories/categories.controllers';
import { AuthService } from './auth/auth.services';
import { AuthController } from './auth/auth.controllers';
import { auth } from './auth.config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UserController,FlowsController,GoalController,CategoryController,AuthController],
  providers: [UsersService,FlowsServices,GoalServices,CategoriesServices,AuthService,
  {provide:"AUTH",useValue:auth}],
  exports:['AUTH']
})
export class AppModule {}
