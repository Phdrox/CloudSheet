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
    async getFlows(){
        return await this.flowsServices.getFlows()
    }

    @Get(':id')
    async getFlowById(@Param('id') id:number){
        return await this.flowsServices.getFlowById(id)
    }

    @Put(':id')
    async updateFlow(@Param('id') id:number, @Body() flows:IFlows){
        return await this.flowsServices.updateFlow(id, flows)
    }

    @Delete(':id')
    async deleteFlow(@Param('id') id:number){
        return await this.flowsServices.deleteFlow(id)
    }
}