import { Injectable } from "@nestjs/common";
import { db } from "../database/db.js";
import type { IFlows } from "./interfaces/flows-type.js";
import { asc, eq,ilike,sql } from "drizzle-orm";
import {banks, flows} from "../database/schemas.js"
import { schemaFlows } from "../schemas/schemas-zod.js";
import { usePagination, usePaginationId, usePaginationIdBanks } from "../hook/pagination.js";


@Injectable()
export class FlowsServices{

   async createFlow(flow:IFlows){
        const dataToSave = {
            ...flow,
            price: String(flow.price),
            date: new Date(flow.date).toISOString().split('T')[0]
        };
        
        const validate= await schemaFlows.safeParseAsync(flow)
        if(validate.success){
            await db.insert(flows).values(dataToSave).returning()
            return {message:'Flow created successfully'}
        }
        else{
            console.log(validate.error.flatten())
            return {message:'Error creating flow'}
        }    
   }

   async getFlows(page:any,search:any){
    try{
        const {data,meta}= await usePagination({page,search,limit:20},flows,flows.name)
        if(data.length===0){
            return {message:'No flows found'}
        }
        return {message:'Flows found', data, meta}
    }
    catch(error){
        return {message:'Error getting flows', error}
    }
   }

   async getFlowById(id:string){
    try{
        const data=await db.select(
            {id: flows.id,
            name: flows.name,
            type: flows.type,
            id_categories:flows.id_categories,
            payment: flows.payment,
            price: flows.price,
            date: flows.date,
            bank:banks.name,
            id_bank:flows.id_name_banks,
            compeCode:banks.compeCode})
            .from(flows).leftJoin(banks,eq(flows.id_name_banks,banks.id)).where(eq(flows.id,id))
        if(data.length===0){
            return {message:'Flow not found'}
        }
        return {message:'Flow found', data}
    }
    catch(error){
        return {message:'Error getting flow', error}
    }}
   
    async getFlowByIdMy(id:string){
    try{
        const data=await db.select({id: flows.id,
            name: flows.name,
            type: flows.type,
            id_categories:flows.id_categories,
            payment: flows.payment,
            price: flows.price,
            date: flows.date,
            bank:banks.name,
            id_bank:flows.id_name_banks,
            compeCode:banks.compeCode})
        .from(flows)
        .leftJoin(banks,eq(flows.id_name_banks,banks.id))
        .where(eq(flows.id_account,sql`${id}::uuid`))
        
        if(data.length===0){
            return {message:'Flow not found'}
        }
        return {message:'Flow found', data}
    }
    catch(error){
        return {message:'Error getting flow', error}
    }}

    async getFlowByIdMyPage(id:string,page?:any,search?:any){
    try{
        const {data,meta}= await usePaginationIdBanks({page,search,limit:20},flows,flows.name,id)
        if(data.length===0){
            return {message:'Flow not found'}
        }      
        return {message:'Flow found', data,meta}
    }
    catch(error){
        return {message:'Error getting flow', error}
    }}

    async updateFlow(id:string, flow:IFlows){
        const validate= await schemaFlows.safeParseAsync(flow)
        if(validate.success){
           await db.update(flows).set(flows).where(eq(flows.id,id)).returning()
           return {message:'Flow updated successfully'}
        }else{
            return {message:'Error updating flow'}
        }
    }

    async deleteFlow(id:string){
        try{
            await db.delete(flows).where(eq(flows.id,id)).returning()
            return {message:'Flow deleted successfully'}
        }
        catch(error){
            return {message:'Error deleting flow', error}
        }
    }


}

