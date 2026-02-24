import { Controller,Post,Get,Body } from "@nestjs/common";
import { hash } from "argon2";
import { AuthService } from "./auth.services";
import type { IAuth } from "./interfaces/auth-type";

@Controller("/auth")
export class AuthController{
    constructor(
        private readonly AuthServices:AuthService
    ){}

    @Post()
    async loginAuth(@Body() auth:IAuth){
        return await this.AuthServices.login(auth)
    }

    @Get()
    async logout(){
        return await this.AuthServices.logout()
    }
}
