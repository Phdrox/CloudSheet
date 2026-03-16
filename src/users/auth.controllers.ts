import { Controller,All,Res,Req} from "@nestjs/common"
import { auth } from "../auth.js";
import {Response } from "express";
import { Request } from "@nestjs/common";

@Controller('api/auth')
export class AuthController {
@All('*')
async handler(@Req() req: Request, @Res() res: Response) {
  const response = await auth.handler(req);

  // Repassa os headers corretamente, especialmente múltiplos Set-Cookie
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      res.append(key, value); // Usa .append para não sobrescrever múltiplos cookies
    } else {
      res.setHeader(key, value);
    }
  });

  const body = await response.json(); // Better Auth costuma retornar JSON
  return res.status(response.status).send(body);
}
}