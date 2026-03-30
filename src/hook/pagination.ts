import { ilike, count,eq,and} from "drizzle-orm";
import z, { number, string,coerce, uuid } from "zod";
import { db } from "../database/db.js";
import { banks } from "../database/schemas.js";

const schemaPaginationId=z.object({
  page:coerce.number().default(1),
  limit:number().default(20),
  userId:uuid().optional(),
  search:string().optional()
}).transform((data)=>({...data,offset:(data.page-1)*data.limit}))


export type PaginationsType=z.input<typeof schemaPaginationId>

export async function usePagination({page=1,search=""}:PaginationsType,table:any,searchColumn:any){
    const result=await schemaPaginationId.safeParseAsync({page,search})
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

export async function usePaginationId({page=1,search=""}:PaginationsType,table:any,searchColumn:any,userId?:string){
    const result=await schemaPaginationId.safeParseAsync({page,search})
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


export async function usePaginationIdBanks({page=1,search=""}:PaginationsType,table:any,searchColumn:any,userId?:string){
    const result=await schemaPaginationId.safeParseAsync({page,search})
    const {limit,offset, search:termSearch,page:currentPage}= result.success?result.data
    :{limit:20,page:0,search:'',offset:0}
    
   const searchFilter = (termSearch && searchColumn) ? ilike(searchColumn, `%${termSearch}%`) : undefined;
    const userFilter = userId ? eq(table.id_account, userId) : undefined;

    const finalFilter = and(...[userFilter, searchFilter].filter(Boolean));
    const [totalResult, rows] = await Promise.all([
        db.select({ value: count() }).from(table).where(finalFilter),
        db.select({flow:table,bank:{name:banks.name,compeCode:banks.compeCode}}).from(table).where(finalFilter).leftJoin(banks,eq(table.id_names_banks,banks.id)).limit(limit).offset(offset)
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