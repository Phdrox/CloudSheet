import { auth } from "src/auth.config";
export interface IAuth{
email:string;
password:string;
}

export type AuthType= typeof auth