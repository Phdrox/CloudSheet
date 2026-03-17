import { Controller,Get, Param } from "@nestjs/common";
import { UsersService } from "./users.services.js";
import type { UUID } from "crypto";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";



@Controller('/users')
export class UserController{

    constructor( private readonly userService:UsersService){}
    
    
    @Get("")
    @AllowAnonymous()
    async getAll(){
        return this.userService.getAllUsers()
    }
    
    @Get(":id")
    @AllowAnonymous()
    async getUser(@Param("id") id:UUID){
        return this.userService.getUserById(id)
    }


}