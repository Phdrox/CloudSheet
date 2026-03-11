import { Controller,Get, Param } from "@nestjs/common";

import { AllowAnonymous } from "@thallesp/nestjs-better-auth";


@Controller('/')
export class AppController{

    @Get("/")
    @AllowAnonymous()
    async getAll(){
        return {helloWorld:":)"}
    }
    

}