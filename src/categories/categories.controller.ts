import {Controller, Get,Param, Delete, UseGuards, Req} from '@nestjs/common';
import { CategoriesServices } from './categories.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller("category")
export class CategoryController{
 constructor(
    private readonly CategoriesService:CategoriesServices
 ){}
 
 @Get("")
 async getAllCategories(){
    return await this.CategoriesService.getCategories()
 }
 
@Get('mycategories')
@UseGuards(AuthGuard)
 async getCategoriesById(@Req() req:any){
    return await this.CategoriesService.getCategoryById(req.user.id)
 }

 @Get(':id')
 async getCategoriesId(@Param('id') id:number){
    return await this.CategoriesService.getCategoryById(id)
 }

@Delete(":id")
async deleteCategory(@Param() id:number){
    return await this.CategoriesService.deleteCategory(id)
}
}