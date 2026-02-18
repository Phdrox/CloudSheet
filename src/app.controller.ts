import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

type IParam={
  id:number
}

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Param() params:IParam): string {
    return `Este id é `;
  }
}
