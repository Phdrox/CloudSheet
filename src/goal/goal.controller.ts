import { Controller,Get,Post,Put,Delete,Body,Param, UseGuards,Req } from "@nestjs/common";
import type { IGoal } from "./interfaces/goal-type.js";
import { GoalServices } from "./goal.service.js";
import { AuthGuard } from "../auth/auth.guard.js";

@Controller("goals")
export class GoalController{
    constructor(
        private readonly goalService:GoalServices
    ){}

@UseGuards(AuthGuard)
@Post("")
async createGoal(@Body() goals:IGoal){
    return await this.goalService.createGoal(goals)
} 

@UseGuards(AuthGuard)
@Get("")
async getAllGoals(@Body() page: number,search:string){
    return await this.goalService.getGoals(page,search)
}


@UseGuards(AuthGuard)
@Get("mygoals")
async getGoalById(@Req() req:any){
    return await this.goalService.getGoalsByIdMy(req.user.id)
}

@UseGuards(AuthGuard)
@Get(":id")
async getGoalId(@Param("id") id:string,){
    return await this.goalService.getGoalById(id)
}

@UseGuards(AuthGuard)
@Put(":id")
async updateGoal(@Param("id") id:string, @Body() goals:IGoal){
    return await this.goalService.updateGoal(id,goals)
}

@UseGuards(AuthGuard)
@Delete(":id")
async deleteGoal(@Param("id") id:string){
   return await this.goalService.deleteGoal(id)
}

}