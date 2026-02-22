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

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UserController,FlowsController,GoalController,CategoryController],
  providers: [UsersService,FlowsServices,GoalServices,CategoriesServices],
})
export class AppModule {}
