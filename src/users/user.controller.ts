import { Controller,Get, Param,Post,Body,Put, Delete,UseGuards } from "@nestjs/common";
import { User, UsersService } from "./users.service.js";
import type { UUID } from "crypto";
import { AuthGuard } from "../auth/auth.guard.js";
import { Roles } from "../roles/roles.decorator.js";
import { Public } from "../roles/public.decorator.js";

@Controller('/users')
export class UserController{

    constructor( private readonly userService:UsersService){}
    @UseGuards(AuthGuard)
    @Roles('admin')
    @Get("")
    async getAll(){
        return await this.userService.getAllUsers()
    }
    @UseGuards(AuthGuard)
    @Roles('admin','user')
    @Get(":id")
    async getUser(@Param("id") id:UUID){
        return await this.userService.getUserById(id)
    }

    @UseGuards(AuthGuard)
    @Roles('admin')
    @Put(":id")
    async putUser(@Body() id:UUID, data:User,type:string){
        return await this.userService.putUserById(id,data,type)
    }
    
    @UseGuards(AuthGuard)
    @Roles('admin')
    @Delete(':id')
    async deleteUser(@Param() id:UUID){
        return await this.userService.deleteUser(id)
    }
    
    @Public()
    @Roles('user','admin')
    @Put('sendemail')
    async sendEmail(@Body() email:string){
        return await this.userService.sendEmail(email)
    }

    @Public()
    @Roles('user','admin')
    @Put('resetpass')
    async resetPass(@Body() data: { code: string, password: string }){
        return await this.userService.resetPassword(data.password,data.code)
    }
}