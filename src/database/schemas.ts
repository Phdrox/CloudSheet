import {pgTable,varchar,timestamp,real,date,integer,uuid,serial,boolean} from "drizzle-orm/pg-core"

export const account= pgTable("account",{
 id:uuid('id').defaultRandom().primaryKey(),
 name:varchar("name",{length:150}).notNull(),
 email:varchar("email").notNull().unique(), 
 password:varchar("password").notNull(),
 type:varchar({length:10}).notNull().$defaultFn(()=>'normal'),
 token:varchar("token",{length:255}),
 createdAt: timestamp("created_at").defaultNow().notNull(),
 updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
})

export const categories=pgTable('category',{
    id:integer('id').primaryKey().generatedAlwaysAsIdentity(),
    type_categorie:varchar("type_categorie",{length:50}).notNull().unique()
})

export const flows = pgTable("flows", {
  id: uuid("id").defaultRandom().primaryKey(),
  id_categories: varchar("id_categories").references(() => categories.type_categorie),
  id_account:uuid('id_account').notNull().references(()=> account.id),
  id_namebank:varchar().notNull().references(()=>banks.name),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 120 }).notNull(),
  payment: varchar("payment", { length: 130 }).notNull(),
  price: varchar("price").notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updateAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
})

export const goal = pgTable("goal", {
  id: uuid("id").defaultRandom().primaryKey(),
  id_account: uuid("id_account").references(() => account.id),
  name: varchar("name", { length: 150 }).notNull(),
  value: varchar("value"),
  have: varchar("have"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updateAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
})

export const banks = pgTable('banks', {
  id: serial('id').primaryKey(),
  ispb: varchar('ispb', { length: 8 }).unique().notNull(),
  compeCode: varchar('compe_code', { length: 3 }),
  name: varchar('name', { length: 255 }).notNull(),
  logoUrl: varchar('logo_url', { length: 500 }),
  isActive: boolean('is_active').default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
});







