import { Injectable } from "@nestjs/common";
import { db } from "../database/db.js";
import type { IFlows } from "./interfaces/flows-type.js";
import { asc, eq,ilike } from "drizzle-orm";
import {banks, flows} from "../database/schemas.js"
import { schemaFlows } from "../schemas/schemas-zod.js";
import { usePagination, usePaginationId } from "../hook/pagination.js";
import { IBank } from "./interfaces/bank-type.js";
import axios from "axios";

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
        const data=await db.select().from(flows).where(eq(flows.id,id))
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
        const data=await db.select({flow:flows,bank:{name:banks.name,compeCode:banks.compeCode}})
        .from(flows)
        .leftJoin(banks,eq(flows.id_name_banks,banks.id))
        .where(eq(flows.id_account,id))
        
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
        const {data,meta}= await usePaginationId({page,search,limit:20},flows,flows.name,id)
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

    async postbank(){
        try{
            const {data:bankData}= await axios.get("https://brasilapi.com.br/api/banks/v1")
            
            for(const bank of bankData as IBank[]){
                const ispbStr = String(bank.ispb).padStart(8, '0');
                const nameStr = bank.fullName || bank.name || "Banco Desconhecido"; // Garante string
                const codeStr = bank.code !== null && bank.code !== undefined ? String(bank.code) : null;
                await db.insert(banks).values({ispb:ispbStr,name:nameStr,compeCode:codeStr}).onConflictDoUpdate({target:banks.ispb,set: {
                name: bank.fullName,
            },})
            }
            
        }catch(err){
            console.log(err)
        }
    }
    
    async getbank(search){
        try{
        const data= await db.select().from(banks)
        .where((search)?ilike(banks.name,`%${search}%`):undefined)
        .orderBy(asc(banks.name))
        .limit(50)
        if(data.length===0){
            return {message:'No bank founded'}
        }
        return data
    }
    catch(error){
        return {message:'Error getting banks', error}
    }
    }
}

