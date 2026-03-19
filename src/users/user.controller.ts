import { Controller,Get, Param,Post,Body,Res, Put, Delete } from "@nestjs/common";
import { User, UsersService } from "./users.service.js";
import type { UUID } from "crypto";

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

    @Put(":id")
    async putUser(@Body() id:UUID, data:User,type:string){
        return await this.userService.putUserById(id,data,type)
    }

    @Delete(':id')
    async deleteUser(@Body() id:UUID){
        return await this.userService.deleteUser(id)
    }


}