import { Injectable } from "@nestjs/common";
import { db } from "src/database/db";
import { ICategory } from "./interfaces/category-type";
import { eq } from "drizzle-orm";
import {categories} from "src/database/schemas"

@Injectable()
export class CategoriesServices{
   constructor(
    private readonly db=db
   ){}

    async createCategory(category:ICategory){
        try{
            await this.db.insert(categories).values(category).returning()
            return {message:'Category created successfully'}
        }
        catch(error){
            return {message:'Error creating category', error}
        }
    }

    async getCategories(){
        try{
            const data=await this.db.select().from(categories)
            if(data.length===0){
                return {message:'No categories found'}
            }
            return {message:'Categories found', data}
        }
        catch(error){
            return {message:'Error getting categories', error}
        }
    }

    async getCategoryById(id:number){
        try{
            const data=await this.db.select().from(categories).where(eq(categories.id,id))
            if(data.length===0){
                return {message:'Category not found'}
            }
            return {message:'Category found', data}
        }
        catch(error){
            return {message:'Error getting category', error}
        }
    }

    async deleteCategory(id:number){
        try{
            await this.db.delete(categories).where(eq(categories.id,id)).returning()
            return {message:'Category deleted successfully'}
        }
        catch(error){
            return {message:'Error deleting category', error}
        }
    }
}