import { Injectable } from "@nestjs/common";
import { db } from "src/database/db";
import { IFlows } from "./interfaces/flows-type";
import { eq } from "drizzle-orm";
import {categories} from "src/database/schemas"
import { schemaFlows } from "src/schemas/schemas-zod";

@Injectable()
export class FlowsServices{
   constructor(
    private readonly db=db
   ){}

   async createFlow(flows:IFlows){
        const validate= await schemaFlows.safeParseAsync(flows)
        if(validate.success){
            await this.db.insert(categories).values(flows).returning()
            return {message:'Flow created successfully'}
        }
        else{
            return {message:'Error creating flow'}
        }    
   }

   async getFlows(){
    try{
        const data=await this.db.select().from(categories)
        if(data.length===0){
            return {message:'No flows found'}
        }
        return {message:'Flows found', data}
    }
    catch(error){
        return {message:'Error getting flows', error}
    }
   }

   async getFlowById(id:number){
    try{
        const data=await this.db.select().from(categories).where(eq(categories.id,id))
        if(data.length===0){
            return {message:'Flow not found'}
        }
        return {message:'Flow found', data}
    }
    catch(error){
        return {message:'Error getting flow', error}
    }}

    async updateFlow(id:number, flows:IFlows){
        const validate= await schemaFlows.safeParseAsync(flows)
        if(validate.success){
           await this.db.update(categories).set(flows).where(eq(categories.id,id)).returning()
           return {message:'Flow updated successfully'}
        }else{
            return {message:'Error updating flow'}
        }
    }

    async deleteFlow(id:number){
        try{
            await this.db.delete(categories).where(eq(categories.id,id)).returning()
            return {message:'Flow deleted successfully'}
        }
        catch(error){
            return {message:'Error deleting flow', error}
        }
    }

}
