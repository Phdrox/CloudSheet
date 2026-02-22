import { Controller,Get,Post,Put,Delete,Body,Param } from "@nestjs/common";
import type { IGoal } from "./interfaces/goal-type";
import { GoalServices } from "./goal.services";

@Controller("goals")
export class GoalController{
    constructor(
        private readonly goalService:GoalServices
    ){}

@Post("")
async createGoal(@Body() goals:IGoal){
    return await this.goalService.createGoal(goals)
}

@Get("")
async getAllGoals(){
    return await this.goalService.getGoals()
}

@Get(":id")
async getGoalById(@Param("id") id:string){
    return await this.goalService.getGoalById(id)
}

@Put(":id")
async updateGoal(@Param("id") id:string, @Body() goals:IGoal){
    return await this.goalService.updateGoal(id,goals)
}

@Delete(":id")
async deleteGoal(@Param("id") id:string){
   return await this.goalService.deleteGoal(id)
}

}