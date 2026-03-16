import { Controller,All,Res,Req} from "@nestjs/common"
import { auth } from "../auth.js";
import {Response } from "express";
import { Request } from "@nestjs/common";

@Controller('api/auth')
export class AuthController {
@All('*')
async handler(@Req() req: Request, @Res() res: Response) {
  const response = await auth.handler(req);

  // 1. Repassar Headers
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      res.append(key, value);
    } else {
      res.setHeader(key, value);
    }
  });

  // 2. Lidar com o corpo da resposta de forma segura
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const body = await response.json();
    return res.status(response.status).send(body);
  } else {
    const body = await response.text();
    return res.status(response.status).send(body);
  }
}}