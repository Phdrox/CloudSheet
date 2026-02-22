import { db } from "./db";
import { categories } from "./schemas";

async function seed(){
    const data=[
        "Saúde",
        "Transporte",
        "Viagem",
        "Contas",
        "Alimentação",
        "Mercado",
        "Bar e Restaurante",
        "Roupas",
        "Receita",
        "Moradia",
        "Educação",
        "Investimento",
        "Lazer",
        "Streaming",
    ]
    const dataInsert:any=[]

    for(let i=0;i<data.length;i++){
       dataInsert.push({type_categorie:data[i]})
    }

    return await db.insert(categories).values(dataInsert)
}

seed()