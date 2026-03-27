import { ilike, count,eq,and} from "drizzle-orm";
import z, { number, string,coerce, uuid } from "zod";
import { db } from "../database/db.js";

const schemaPagination=z.object({
  offset:coerce.number(),
  page:coerce.number(),
  limit:number(),
  search:string().optional()
}).transform((data)=>({...data,offset:(data.page-1)*data.limit}))

const schemaPaginationId=z.object({
  offset:coerce.number(),
  page:coerce.number(),
  limit:number(),
  userId:uuid(),
  search:string().optional()
}).transform((data)=>({...data,offset:(data.page-1)*data.limit}))


export type PaginationsType=z.infer<typeof schemaPagination>

export async function usePagination(page:any=1,search:any="",table:any,searchColumn:any){
    const result=await schemaPagination.safeParseAsync({page,search})
    const {limit,offset, search:termSearch,page:currentPage}= result.success?result.data
    :{limit:20,page:0,search:'',offset:0}
    
    const filter=(termSearch && searchColumn)?ilike(searchColumn,`%${termSearch}%`):undefined
    const [totalResult, rows] = await Promise.all([
        db.select({ value: count() }).from(table).where(filter),
        db.select().from(table).where(filter).limit(limit).offset(offset)
    ]);

    const totalCount = totalResult[0].value;
    return {
        data: rows,
        meta: {
            page: currentPage,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit)
        }
}}

//PagginationID 
export type PaginationsTypeId=z.infer<typeof schemaPaginationId>

export async function usePaginationId(page:any=1,search:any="",table:any,searchColumn:any,userId?:string){
    const result=await schemaPagination.safeParseAsync({page,search})
    const {limit,offset, search:termSearch,page:currentPage}= result.success?result.data
    :{limit:20,page:0,search:'',offset:0}
    
   const searchFilter = (termSearch && searchColumn) ? ilike(searchColumn, `%${termSearch}%`) : undefined;
    const userFilter = userId ? eq(table.id_account, userId) : undefined;

    const finalFilter = and(...[userFilter, searchFilter].filter(Boolean));
    const [totalResult, rows] = await Promise.all([
        db.select({ value: count() }).from(table).where(finalFilter),
        db.select().from(table).where(finalFilter).limit(limit).offset(offset)
    ]);

    const totalCount = totalResult[0].value;
    return {
        data: rows,
        meta: {
            page: currentPage,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit)
        }
}}