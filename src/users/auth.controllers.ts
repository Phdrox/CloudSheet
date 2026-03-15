import { Controller,All,Res,Req} from "@nestjs/common"
import { auth } from "../auth.js";
import { Request,Response } from "@nestjs/common";

@Controller('api/auth')
export class AuthController {
 
 @All('*')
 async handler(@Req() req:Request, @Res() res: any){
  const response= await auth.handler(req)
  

    const body = await response.text()

    res.status(response.status)

    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })

    return res.send(body)
  }
}