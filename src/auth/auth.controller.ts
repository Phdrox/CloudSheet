import {Controller, Post,HttpCode,HttpStatus,Body, Get, UseGuards,Req,Res, UnauthorizedException } from "@nestjs/common"
import { AuthService } from "./auth.service.js";
import { AuthGuard } from "./auth.guard.js";
import {User} from "../users/users.service.js"
import { Request, Response } from "express";

@Controller('auth')
export class AuthController{
    constructor( 
        private authService:AuthService,
    ){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async sign(@Body() signInDto: Record<string, any>, @Res({ passthrough: true }) res: Response){
        
        const {access_token,refresh_token}=await this.authService.signIn({email:signInDto.email,password:signInDto.password});

        res.cookie('access_token',access_token,{
            httpOnly:true,
            secure:true,
            sameSite:'strict',
            maxAge:60*1000
        })

        res.cookie("refresh_token",refresh_token,{
            httpOnly:true,
            secure:true,
            sameSite:'strict',
            maxAge:7*24*60* 60* 1000
        });

        return {message:"Logado com sucesso"};
    }

    @Post('register')
    register(@Body() signUp:User){
      return this.authService.signUp(signUp)
    }
    
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Req() req){
        return req.user;
    }

    @Post('logout')
    async logout(@Req() req:Request, @Res({passthrough:true}) res: Response){
        const refreshToken=req.cookies['refresh_token'];
        if (refreshToken){
            await this.authService.clearSession(refreshToken)
        }

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        return {message:'Logged out'};
    }
    
    @Post('refresh')
    async refresh(@Res({ passthrough: true }) res:Response,@Req() req:Request){
        const refreshToken=req.cookies['refresh_token'];
        if (!refreshToken) {
        throw new UnauthorizedException("Refresh token não encontrado");
    }
        return this.authService.refreshTokens(refreshToken,req)
    }
}

