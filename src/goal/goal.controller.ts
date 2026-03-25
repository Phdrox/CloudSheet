import { Controller,Get,Post,Put,Delete,Body,Param, UseGuards,Req } from "@nestjs/common";
import type { IGoal } from "./interfaces/goal-type.js";
import { GoalServices } from "./goal.service.js";
import { AuthGuard } from "../auth/auth.guard.js";

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
async getAllGoals(@Body() page: number,search:string){
    return await this.goalService.getGoals(page,search)
}

@Get("mygoals")
@UseGuards(AuthGuard)
async getGoalById(@Req() req:any){
    return await this.goalService.getGoalById(req.user.id)
}

@Get(":id")
async getGoalId(@Param("id") id:string,){
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