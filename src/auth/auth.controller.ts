import {Controller, Post,HttpCode,HttpStatus,Body, Get, UseGuards,Request} from "@nestjs/common"
import { AuthService } from "./auth.service.js";
import { AuthGuard } from "./auth.guard.js";
import {User} from "../users/users.service.js"

type Login={
    password:string;
    email:string;
}


@Controller('/auth')
export class AuthController{
    constructor( private authService:AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    sign(@Body() signInDto: Record<string, any>){
        return this.authService.signIn({email:signInDto.email,password:signInDto.password})
    }

    @Post('/register')
    register(@Body() signUp:User){
      return this.authService.signUp(signUp)
    }
    
    @UseGuards(AuthGuard)
    @Get('/profile')
    getProfile(@Request() req){
        return req.user;
    }

}
