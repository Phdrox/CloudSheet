import { ilike, count} from "drizzle-orm";
import z, { number, string,coerce } from "zod";
import { db } from "src/database/db";

const schemaPagination=z.object({
  offset:coerce.number(),
  page:coerce.number(),
  limit:number(),
  search:string().optional()
}).transform((data)=>({...data,offset:(data.page-1)*data.limit}))

export type PaginationsType=z.infer<typeof schemaPagination>

export async function usePagination(page:any,search:any,table:any,searchCollun:any){
    const result=await schemaPagination.safeParseAsync({page,search})
    const {limit,offset, search:termSearch,page:currentPage}= result.success?result.data
    :{limit:20,page:0,search:'',offset:0}
    
    const filter=(termSearch && searchCollun)?ilike(searchCollun,`%${termSearch}%`):undefined
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
