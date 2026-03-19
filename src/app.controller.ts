import { Controller,Get, Param } from "@nestjs/common";


@Controller('/')
export class AppController{

    @Get("/")
    async getAll(){
        return {helloWorld:":)"}
    }
    

}