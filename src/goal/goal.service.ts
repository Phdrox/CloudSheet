import {Injectable} from "@nestjs/common";
import {db} from "../database/db.js";
import { goal } from "../database/schemas.js";
import type { IGoal } from "./interfaces/goal-type.js";
import { eq } from "drizzle-orm";
import { schemaGoal } from "../schemas/schemas-zod.js";
import { usePagination } from "../hook/pagination.js";

@Injectable()
export class GoalServices{

    async createGoal(goals:IGoal){
        const validate=await schemaGoal.safeParseAsync(goals)
        if(validate.success){
          await db.insert(goal).values(goals).returning()
          return {message:"Goal create successfuly"}  
       }else{
          return {message:"Error when creating goal"}
       }
    }

    async getGoals(page,search){
        try{
            const {data,meta}=await usePagination(page,search,goal,goal.name)
            if (data.length==0){
                return {message:"Not found goal"}
            }
            return {message:"Goal founded",data,meta}
        }
        catch(error){
            return {message:"Error when get all goals"}
        }
    }

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
            await db.update(goal).set(goals).where(eq(goal.id,id))
            return{message:"update with successfuly"}
        }else{
            return {message:"Error when update goal"}
        }
    }

    async deleteGoal(id:string){
        try{
            await db.delete(goal).where(eq(goal.id,id))
            return {message:"Delete with successfuly"}
        }
        catch(error){
            return {message:"Error when delete goal"}
        }
    }
}