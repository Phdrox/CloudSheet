import {Injectable} from "@nestjs/common";
import {db} from "src/database/db";
import { goal } from "src/database/schemas";
import type { IGoal } from "./interfaces/goal-type";
import { eq } from "drizzle-orm";

@Injectable()
export class GoalServices{
    constructor(
        private readonly db=db
    ){}

    async createGoal(gols:IGoal){
        try{
          await db.insert(goal).values(gols).returning()
          return {message:"Goal create successfuly"}  
        }
        catch(error){
            return {message:"Error when creating goal"}
        }
    }

    async getGoals(){
        try{
            const data=await db.select().from(goal)
            if (data.length==0){
                return {message:"Not found goal"}
            }
            return {message:"Goal founded",data}
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
        try{
            await db.update(goal).set(goals).where(eq(goal.id,id))
            return{message:"update with successfuly"}
        }
        catch(erro){
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