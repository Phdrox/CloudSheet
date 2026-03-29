
import { db } from "../database/db.js";
import {banks, flows} from "../database/schemas.js"
import { IBank } from "../banks/bank-type.js";
import axios from "axios";



async function Bank(){
         const {data:bankData}= await axios.get("https://brasilapi.com.br/api/banks/v1")
            
            for(const bank of bankData as IBank[]){
                const ispbStr = String(bank.ispb).padStart(8, '0');
                const nameStr = bank.fullName || bank.name || "Banco Desconhecido"; // Garante string
                const codeStr = bank.code !== null && bank.code !== undefined ? String(bank.code) : null;
                await db.insert(banks).values({ispb:ispbStr,name:nameStr,compeCode:codeStr}).onConflictDoUpdate({target:banks.ispb,set: {
                name: bank.fullName,
            },})
            }

}

Bank()