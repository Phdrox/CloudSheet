import { Controller,Get, Param } from "@nestjs/common";
import { UsersService } from "./users.services.js";
import type { UUID } from "crypto";


@Controller('/users')
export class UserController{

    constructor( private readonly userService:UsersService){}

    @Get("")
    async getAll(){
        return this.userService.getAllUsers()
    }

    @Get(":id")
    async getUser(@Param("id") id:UUID){
        return this.userService.getUserById(id)
    }

}