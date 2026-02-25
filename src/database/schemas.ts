import {pgTable,varchar,timestamp,text,real,date,integer,uuid} from "drizzle-orm/pg-core"
import { randomUUID } from "crypto"

export const users=pgTable('users',{
    id:uuid().primaryKey().$defaultFn(()=>randomUUID()).notNull(),
    name:varchar({length:255}).notNull(),
    username:varchar({length:100}).notNull().unique(),
    email:varchar({length:260}).notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at",).defaultNow().notNull(),
    updateAt: timestamp("updated_at",).$onUpdate(()=>new Date()).notNull(),
})

export const account=pgTable('account',{
  id: uuid().primaryKey().$defaultFn(()=>randomUUID()).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  tokenHash: varchar("token_hash",{length:300}).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
})

export const flows=pgTable('flows',{
    id:uuid().primaryKey().$defaultFn(()=>randomUUID()).notNull(),
    id_categorie:integer().references(()=>categories.id),
    name:varchar({length:255}).notNull(),
    type:varchar({length:120}).notNull(),
    payment:varchar({length:130}).notNull(),
    price:real().notNull(),
    date:date().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updateAt: timestamp("updated_at").$onUpdate(()=>new Date()).notNull(),
})

export const categories=pgTable('category',{
    id:integer('id').primaryKey().generatedAlwaysAsIdentity().unique(),
    type_categorie:varchar({length:50}).notNull().unique()
})

export const goal=pgTable('goal',{
    id:uuid().primaryKey().$defaultFn(()=>randomUUID()).notNull(),
    id_user:uuid().references(()=>users.id),
    id_categories:integer().references(()=>categories.id),
    name:varchar({length:150}).notNull(),
    value:real(),
    have:real(),
    createdAt: timestamp("created_at",).defaultNow().notNull(),
    updateAt: timestamp("updated_at").$onUpdate(()=>new Date()).notNull(),
})
