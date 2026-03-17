import { Controller,Get, Param,Post,Body,Res } from "@nestjs/common";
import { Response } from "express";
import { UsersService } from "./users.services.js";
import type { UUID } from "crypto";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { auth } from "src/auth.js";



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

    @Post('/create/login')
     async createUser(  
        @Body('email') email:string,
        @Body('password') password:string,
        @Res() res:Response
     ){
        const data= await auth.api.signInEmail({body:{email,password},asResponse:true})
        const cookie=data.headers.get('set-cookie')
        res.setHeader('Set-Cookie', cookie)
        return data.json()
     }
}