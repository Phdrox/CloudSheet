import {pgTable,varchar,timestamp,text,real,date,integer,uuid,} from "drizzle-orm/pg-core"

export const users=pgTable('users',{
    id:uuid().primaryKey().defaultRandom().notNull(),
    name:varchar({length:255}).notNull(),
    username:varchar({length:100}).notNull(),
    email:varchar({length:260}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updateAt: timestamp("update_at").$onUpdate(()=>new Date).notNull(),
})

export const account=pgTable('account',{
    password:varchar({length:100}).notNull(),
    access_token:text().notNull(),
    refresh_token:text().notNull(),
})

export const flows=pgTable('expenses',{
    id:uuid().primaryKey().defaultRandom().notNull(),
    id_categorie:integer().references(()=>categories.id),
    name:varchar({length:255}).notNull(),
    type:varchar({length:120}).notNull(),
    payment:varchar({length:130}).notNull(),
    price:real().notNull(),
    date:date().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updateAt: timestamp("update_at").$onUpdate(()=>new Date).notNull(),
})

export const categories=pgTable('categories',{
    id:integer().primaryKey().notNull(),
    type:varchar({length:50}).notNull()
})

export const goal=pgTable('goal',{
    id:uuid().primaryKey().defaultRandom().notNull(),
    id_user:uuid().references(()=>users.id),
    name:varchar({length:150}).notNull(),
    value:real(),
    have:real(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updateAt: timestamp("update_at").$onUpdate(()=>new Date).notNull(),
})
