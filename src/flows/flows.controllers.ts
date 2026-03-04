import {Controller, Get, Post, Body, Param, Delete, Put} from '@nestjs/common';
import { FlowsServices } from './flows.services';
import type { IFlows } from './interfaces/flows-type';


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

    @Get(':id')
    async getFlowById(@Param('id') id:string){
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