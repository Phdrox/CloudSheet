import { Injectable } from "@nestjs/common";
import { db } from "../database/db.js";
import { banks } from "../database/schemas.js";
import axios from "axios"
import { IBank } from "./bank-type.js";
import { ilike,asc } from "drizzle-orm";

    
@Injectable()
export class BankServices{
 
    async postbank(){
        try{
            const {data:bankData}= await axios.get("https://brasilapi.com.br/api/banks/v1")
            
            for(const bank of bankData as IBank[]){
                const ispbStr = String(bank.ispb).padStart(8, '0');
                const nameStr = bank.fullName || bank.name || "Banco Desconhecido"; // Garante string
                const codeStr = bank.code !== null && bank.code !== undefined ? String(bank.code) : null;
                await db.insert(banks).values({ispb:ispbStr,name:nameStr,compeCode:codeStr}).onConflictDoUpdate({target:banks.ispb,set: {
                name: bank.fullName,
            },})
            }
            
        }catch(err){
            console.log(err)
        }
    }
    
   async getBanks(search) {
    try {
        // 1. Inicia a consulta
        const query = db.select().from(banks);

        // 2. Aplica o filtro apenas se houver termo de busca
        if (search) {
            query.where(ilike(banks.name, `%${search}%`));
        }

        const data = await query
            .orderBy(asc(banks.name));

        // 3. Retorna uma estrutura consistente
        if (!data || data.length === 0) {
            return { success: true, data: [], message: 'Nenhum banco encontrado' };
        }

        return { success: true, data };
    } catch (error) {
        // Log do erro real no servidor para depuração
        console.error("Erro no banco de dados em getBanks:", error);
        
        return { 
            success: false, 
            message: 'Erro ao buscar bancos', 
            // Opcional: enviar detalhes do erro apenas em desenvolvimento
            error: process.env.NODE_ENV === 'development' ? error : undefined 
        };
    }
    }
}