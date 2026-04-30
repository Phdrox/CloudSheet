import {pgTable,varchar,timestamp,real,date,integer,uuid,serial,boolean} from "drizzle-orm/pg-core"

export const account= pgTable("account",{
 id:uuid('id').defaultRandom().primaryKey(),
 name:varchar("name").notNull(),
 email:varchar("email").notNull().unique(), 
 password:varchar("password").notNull(),
 type:varchar({length:10}).notNull().$defaultFn(()=>'normal'),
 role:varchar({length:12}).notNull().$default(()=>'admin'),
 token:varchar("token",{length:255}),
 code:varchar("code_pass").$defaultFn(()=>''),
 createdAt: timestamp("created_at").defaultNow().notNull(),
 updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
})

export const categories=pgTable('category',{
    id:integer('id').primaryKey().generatedAlwaysAsIdentity(),
    type_categorie:varchar("type_categorie",{length:50}).notNull().unique()
})

export const banks = pgTable('banks', {
  id: uuid('id').defaultRandom().primaryKey(),
  ispb: varchar('ispb', { length: 8 }).notNull().unique(),
  compeCode: varchar('compe_code', { length: 3 }),
  name:varchar().notNull()
});

export const flows = pgTable("flows", {
  id: uuid("id").defaultRandom().primaryKey(),
  id_categories: varchar("id_categories").references(() => categories.type_categorie),
  id_account:uuid('id_account').notNull().references(()=> account.id),
  id_name_banks:uuid('id_name_banks').notNull().references(()=>banks.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 120 }).notNull(),
  payment: varchar("payment", { length: 130 }).notNull(),
  price: varchar("price").notNull(),
  date: date("date").notNull(),
  constant: boolean("constant").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updateAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
})

export const goal = pgTable("goal", {
  id: uuid("id").defaultRandom().primaryKey(),
  id_account: uuid("id_account").references(() => account.id),
  name: varchar("name").notNull(),
  value: varchar("value"),
  have: varchar("have"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updateAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
})









