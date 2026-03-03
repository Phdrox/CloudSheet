import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { UsersService } from './users/users.services';
import { AuthController } from './users/auth.controllers';
import { FlowsServices } from './flows/flows.services';
import { FlowsController } from './flows/flows.controllers';
import { GoalServices } from './goal/goal.services';
import { CategoriesServices } from './categories/categories.services';
import { GoalController } from './goal/goal.controllers';
import { CategoryController } from './categories/categories.controllers';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';
import { UserController } from './users/user.controllers';

@Module({
  imports: [ConfigModule.forRoot(),AuthModule.forRoot({auth})],
  controllers: [AuthController,FlowsController,GoalController,CategoryController,UserController],
  providers: [UsersService,FlowsServices,GoalServices,CategoriesServices]
})
export class AppModule {}
