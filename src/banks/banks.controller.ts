import { Controller,Query,Get } from "@nestjs/common";
import { BankServices } from "./banks.service.js";


@Controller('banks')
export class BankController{
  constructor(
    private readonly bankService:BankServices
  ){}

  @Get('')
  async getAllBanks(@Query('search') search){
    return await this.bankService.getBanks(search)
  }
}