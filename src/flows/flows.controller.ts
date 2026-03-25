import {Controller, Get, Post, Body, Param, Delete, Put,Req, UseGuards} from '@nestjs/common';
import { FlowsServices } from './flows.service.js';
import type { IFlows } from './interfaces/flows-type.js';
import { AuthGuard } from '../auth/auth.guard.js';


@Controller('flows')
export class FlowsController{
    constructor(private readonly flowsServices:FlowsServices){}

    @Post('')
    async createFlow( @Body() flows:IFlows){
        return await this.flowsServices.createFlow(flows)
    }
    
    @Get('')
    async getFlows(@Body() page: number,search:string){
        return await this.flowsServices.getFlows(page,search)
    }

    @Get('myflows')
    @UseGuards(AuthGuard)
    async getFlowById(@Req() req:any){
        return await this.flowsServices.getFlowById(req.user.id)
    }
    
    @Get(':id')
    async getFlowId(@Param('id') id:string){
        return await this.flowsServices.getFlowById(id)
    }

    @Put(':id')
    async updateFlow(@Param('id') id:string, @Body() flows:IFlows){
        return await this.flowsServices.updateFlow(id, flows)
    }

    @Delete(':id')
    async deleteFlow(@Param('id') id:string){
        return await this.flowsServices.deleteFlow(id)
    }
}