import {betterAuth} from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./database/db.js"
import { hash, verify } from "argon2"
import * as schema from "./database/schemas.js"

export const auth = betterAuth({
  basePath: "/api/auth",

  trustedOrigins: [
    "http://localhost:3000",
    "https://cloud-sheet.vercel.app"
  ],

  database: drizzleAdapter(db,{
    provider:"pg",
    schema
  }),

  emailAndPassword:{
    enabled:true,
    autoSignIn:true
  },

  cookies:{
    sessionToken:{
      attributes:{
        sameSite:"none",
        secure:true
      }
    }
  }
})

