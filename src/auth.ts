import {betterAuth} from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./database/db.js"
import { hash, verify } from "argon2"
import * as schema from "./database/schemas.js"
import { nextCookies } from "better-auth/next-js"

export const auth=betterAuth({
    basePath:"/api/auth",
    trustedOrigins:["https://cloud-sheet.vercel.app","https://cloud-sheet-app.vercel.app"],
    database:drizzleAdapter(db,{
        provider:'pg',
        schema
    }),
    advanced:{
        database:{
            generateId:false
        },
    },
    emailAndPassword:{
        enabled:true,
        autoSignIn:true,
        password:{
            hash: async (password: string) => await hash(password),
            verify: async ({ password, hash: storedHash }) => {
                if (!storedHash) return false;
                return await verify(storedHash, password);
            }
        }
    },
    session:{
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24 *1 // 7 dias
    }
    ,
   cookies:{
    sessionToken:{
      attributes:{
        sameSite:"none",
        secure:true,
        httpOnly:true,
      }    
    }
   },
   plugins:[nextCookies()]
})

