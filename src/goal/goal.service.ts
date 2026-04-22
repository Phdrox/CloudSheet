import {BadRequestException, Injectable} from "@nestjs/common";
import {db} from "../database/db.js";
import { goal } from "../database/schemas.js";
import type { IGoal } from "./interfaces/goal-type.js";
import { eq, sql } from "drizzle-orm";
import { schemaGoal } from "../schemas/schemas-zod.js";
import { usePagination } from "../hook/pagination.js";

@Injectable()
export class GoalServices{

    async createGoal(goals:IGoal){
        const validate = await schemaGoal.safeParseAsync(goals);
        if (validate.success) {
    await db.insert(goal).values(goals).returning();
    return { message: "Goal created successfully" };
  } else {
    console.error("Erro de validação:", validate.error.format());
    return {  
      message: "Error when creating goal", 
      details: validate.error.issues 
    };
  }
    }

    async getGoals(page:number,search:string){
        try{
            const {data,meta}=await usePagination({page,search,limit:20},goal,goal.name)
            if (data.length==0){
                return {message:"Not found goal"}
            }
            return {message:"Goal founded",data,meta}
        }
        catch(error){
            return {message:"Error when get all goals"}
        }
    }

       async getGoalsByIdMy(id:string){
        try{
            const data=await db.select({id: goal.id,
              name: goal.name,
              have:goal.have,
              value:goal.value,
              lack:sql<number>`CAST(${goal.value} AS DECIMAL(10,2)) - CAST(${goal.have} AS DECIMAL(10,2))`
            })
            .from(goal)
            .where(eq(goal.id_account,sql`${id}::uuid`))
            
            if(data.length===0){
                return {message:'Goals not found'}
            }
            return {message:'Goals found', data}
        }
        catch(error){
            return {message:'Error getting goal', error}
        }}

    async getGoalById(id:string){
        try{
            const data=await db.select().from(goal).where(eq(goal.id,id))
            if (data.length==0){
                return {message:"Not found goal"}
            }
            return {message:"Goal founded",data}
        }
        catch(error){
            return {message:"Error when returning goal"}
        }
    }

    async updateGoal(id:string,goals:IGoal){
        const validate=await schemaGoal.safeParseAsync(goals)
        if(validate.success){
            await db.update(goal).set(
                {
                name:validate.data.name,
                id_account:validate.data.id_account,
                have:validate.data.have,
                value:validate.data.value              
                }).where(eq(goal.id,id))
            return{message:"update with successfuly"}
        }else{
            throw new BadRequestException({
            message: "Erro de validação nos dados da meta",
            errors: validate.error.flatten()
        });
        }
    }

    async deleteGoal(id:string){
        try{
            await db.delete(goal).where(eq(goal.id,id)).returning()
            return {message:"Delete with successfuly"}
        }
        catch(error){
            return {message:"Error when delete goal"}
        }
    }
}