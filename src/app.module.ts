import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { FlowsServices } from './flows/flows.service.js';
import { FlowsController } from './flows/flows.controller.js';
import { GoalServices } from './goal/goal.service.js';
import { CategoriesServices } from './categories/categories.service.js';
import { GoalController } from './goal/goal.controller.js';
import { CategoryController } from './categories/categories.controller.js';
import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { BankController } from './banks/banks.controller.js';
import { BankServices } from './banks/banks.service.js';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
 

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), AuthModule, UsersModule,
    MailerModule.forRoot({
      transport:{
        host:process.env.NODEMAILER_HOST,
        port: 587,
        auth:{
          user:process.env.NODEMAILER_USER,
          pass:process.env.NODEMAILER_PASS
        },
        template:{
          adapter:new HandlebarsAdapter(),
          options:{
            strict:true
          }
        }
      }
    })
  ],
  controllers: [AppController,FlowsController,GoalController,CategoryController,BankController],
  providers: [FlowsServices,GoalServices,CategoriesServices,BankServices]
})
export class AppModule {}
