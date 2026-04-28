import { Injectable } from "@nestjs/common";
import { db } from "../database/db.js";
import type { IFlows } from "./interfaces/flows-type.js";
import { and, eq,ilike,sql, sum } from "drizzle-orm";
import {banks, flows} from "../database/schemas.js"
import { schemaFlows } from "../schemas/schemas-zod.js";
import { usePagination, usePaginationIdBanks } from "../hook/pagination.js";


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

   async getFlows(page:any,search:any,date:any){
    try{
        const {data,meta}= await usePagination({page,search,limit:20},flows,flows.name,date)
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
        const data=await db.select({
            id: flows.id,
            name: flows.name,
            type: flows.type,
            id_categories:flows.id_categories,
            payment: flows.payment,
            price: flows.price,
            date: flows.date,
            bank:banks.name,
            id_bank:flows.id_name_banks,
            compeCode:banks.compeCode
        })
        .from(flows).leftJoin(banks,eq(flows.id_name_banks,banks.id)).where(eq(flows.id,id))
        if(data.length===0){
            return {message:'Flow not found'}
        }
        return {message:'Flow found', data}
    }
    catch(error){
        return {message:'Error getting flow', error}
    }}
   
    async getFlowByIdMy(id:string,date=1){
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
            compeCode:banks.compeCode,
        })
        .from(flows)
        .leftJoin(banks,eq(flows.id_name_banks,banks.id))
        .where(
            and(
            eq(flows.id_account,sql`${id}::uuid`),
            ilike(sql`EXTRACT (MONTH FROM ${flows.date})::text`,`%${date}%`)
          )
        )
        
        if(data.length===0){
            return {message:'Flow not found'}
        }
        return {message:'Flow found', data}
    }
    catch(error){
        return {message:'Error getting flow', error}
    }}

    async getFLowsDataTotal(id:string,date='1'){
            try{
              const sumEarn = sql<number>`COALESCE(SUM(CAST(${flows.price} AS DECIMAL(10,2))) FILTER (WHERE ${flows.type} = 'ganho') OVER(), 0)`;
              const sumExpense = sql<number>`COALESCE(SUM(CAST(${flows.price} AS DECIMAL(10,2))) FILTER (WHERE ${flows.type} = 'gasto') OVER(), 0)`;
              const sumTotal = sql<number>`(${sumEarn}) - (${sumExpense})`;

                const data=await db.select({id: flows.id,
                    sumEarn: sumEarn,
                    sumExpense: sumExpense,
                    sumTotal: sumTotal,
                })
                .from(flows).where(and(
                    eq(flows.id_account,sql`${id}::uuid`),
                    ilike(sql`EXTRACT (MONTH FROM ${flows.date})::text`,`%${date}%`)
                ))
                if(data.length===0){
                    return {data:[{sumEarn:0,sumExpense:0,sumTotal:0}]}
                }

                return {message:'Flows found', data}
            }catch(error){
                return {message:'Error getting flow', error}
            }
    }

    async getFlowByIdMyPage(id:string,page?:any,search?:any,date?:any){
    try{
        const {data,meta}= await usePaginationIdBanks({page,search,limit:20},flows,flows.name,id,date)
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
           await db.update(flows).set(validate.data).where(eq(flows.id,id)).returning()
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

