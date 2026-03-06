import { Controller,All,Res,Req} from "@nestjs/common"
import { auth } from "src/auth";
import { Request,Response } from "@nestjs/common";

@Controller('auth')
export class AuthController {
 
 @All('/*')
 async handler(@Req() req:Request, @Res() res: any){
  const response= await auth.handler(req)
  
  if (response instanceof Response){
    const body=await response.json();
    return res.status(response.status).send(body);
  }
  
  return res.status(500).send({message:"Internal Auth Error"})
 }
}