import {Controller, Get, Post, Body, Param, Delete, Put,Req, UseGuards, Query} from '@nestjs/common';
import { FlowsServices } from './flows.service.js';
import type { IFlows } from './interfaces/flows-type.js';
import { AuthGuard } from '../auth/auth.guard.js';

@UseGuards(AuthGuard)
@Controller('flows')
export class FlowsController{
    constructor(private readonly flowsServices:FlowsServices){}

    @UseGuards(AuthGuard)
    @Post('')
    async createFlow( @Body() flows:IFlows){
        return await this.flowsServices.createFlow(flows)
    }
    
    @UseGuards(AuthGuard)
    @Get('')
    async getFlows(@Query('page') page: number,@Query('search') search:string, @Query('date') date:string ){
        return await this.flowsServices.getFlows(page,search,date)
    }
    
    @UseGuards(AuthGuard)
    @Get('myflows')
    async getFlowById(@Req() req:any,@Query('date') date:string){
        console.log(req.user.id)
        return await this.flowsServices.getFlowByIdMy(req.user.id,date)
    }
    
    @UseGuards(AuthGuard)
    @Get('allflows')
    async getFlowByIdPage(@Query('page') page: number,@Query('search') search:string,@Req() req:any, @Query('date') date:string){
        console.log(req.user.id)
        return await this.flowsServices.getFlowByIdMyPage(req.user.id,page,search,date)
    }

    @UseGuards(AuthGuard)
    @Get('totalflows')
    async getFlowByIdTotal(@Req() req:any,@Query('date') date:string){
        console.log(req.user.id)
        return await this.flowsServices.getFLowsDataTotal(req.user.id,date)
    }
    
    @UseGuards(AuthGuard)
    @Get(':id')
    async getFlowId(@Param('id') id:string){
        return await this.flowsServices.getFlowById(id)
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async updateFlow(@Param('id') id:string, @Body() flows:IFlows){
        return await this.flowsServices.updateFlow(id, flows)
    }
    
    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteFlow(@Param('id') id:string){
        return await this.flowsServices.deleteFlow(id)
    }

}