import {pgTable,varchar,timestamp,text,real,date,integer,uuid,boolean,index} from "drizzle-orm/pg-core"
import { randomUUID } from "crypto"
import {relations} from "drizzle-orm"

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const categories=pgTable('category',{
    id:integer('id').primaryKey().generatedAlwaysAsIdentity(),
    type_categorie:varchar({length:50}).notNull().unique()
})

export const flows=pgTable('flows',{
    id:uuid().defaultRandom().primaryKey().notNull(),
    idCategorie:integer('id_categories').references(()=>categories.id),
    name:varchar({length:255}).notNull(),
    type:varchar({length:120}).notNull(),
    payment:varchar({length:130}).notNull(),
    price:real().notNull(),
    date:date().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updateAt: timestamp("updated_at").$onUpdate(()=>new Date()).notNull(),
})

export const goal=pgTable('goal',{
    id:uuid().defaultRandom().primaryKey().notNull(),
    idUser:uuid('id_user').references(()=>user.id),
    name:varchar({length:150}).notNull(),
    value:real(),
    have:real(),
    createdAt: timestamp("created_at",).defaultNow().notNull(),
    updateAt: timestamp("updated_at").$onUpdate(()=>new Date()).notNull(),
})

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey().$defaultFn(()=>randomUUID()),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey().$defaultFn(()=>randomUUID()),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey().$defaultFn(()=>randomUUID()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
