import { Controller,Get, Param,Post,Body,Put, Delete,UseGuards } from "@nestjs/common";
import { User, UsersService } from "./users.service.js";
import type { UUID } from "crypto";
import { AuthGuard } from "../auth/auth.guard.js";

@Controller('/users')
export class UserController{

    constructor( private readonly userService:UsersService){}
    
    
    @Get("")
    async getAll(){
        return await this.userService.getAllUsers()
    }
    
    @Get(":id")
    async getUser(@Param("id") id:UUID){
        return await this.userService.getUserById(id)
    }
    @UseGuards(AuthGuard)
    @Put(":id")
    async putUser(@Body() id:UUID, data:User,type:string){
        return await this.userService.putUserById(id,data,type)
    }
    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteUser(@Body() id:UUID){
        return await this.userService.deleteUser(id)
    }


}