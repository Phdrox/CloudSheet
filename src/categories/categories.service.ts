import { Injectable } from "@nestjs/common";
import { db } from "../database/db.js";
import type { ICategory } from "./interfaces/category-type.js";
import { eq } from "drizzle-orm";
import {categories} from "../database/schemas.js"

@Injectable()
export class CategoriesServices{
    async createCategory(category:ICategory){
        try{
            await db.insert(categories).values(category).returning()
            return {message:'Category created successfully'}
        }
        catch(error){
            return {message:'Error creating category', error}
        }
    }

    async getCategories(){
        try{
            const data=await db.select().from(categories)
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
            const data=await db.select().from(categories).where(eq(categories.id,id))
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
            await db.delete(categories).where(eq(categories.id,id)).returning()
            return {message:'Category deleted successfully'}
        }
        catch(error){
            return {message:'Error deleting category', error}
        }
    }
}