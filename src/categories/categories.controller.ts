import {Controller, Get,Param, Delete} from '@nestjs/common';
import { CategoriesServices } from './categories.service.js';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller("category")
export class CategoryController{
 constructor(
    private readonly CategoriesService:CategoriesServices
 ){}
 
 @Get("")
 @AllowAnonymous()
 async getAllCategories(){
    return await this.CategoriesService.getCategories()
 }
 
 @Get(":id")
 @AllowAnonymous()
 async getCategoriesById(@Param() id:number){
    return await this.CategoriesService.getCategoryById(id)
 }

@Delete(":id")
async deleteCategory(@Param() id:number){
    return await this.CategoriesService.deleteCategory(id)
}
}