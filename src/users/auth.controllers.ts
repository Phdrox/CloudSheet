import { Controller,All,Res,Req} from "@nestjs/common"
import { auth } from "../auth.js";
import { Request,Response } from "@nestjs/common";

@Controller('api/auth')
export class AuthController {

  @All('*')
  async handler(@Req() req: Request, @Res() res: any) {

    const response = await auth.handler(req)

    // copiar headers (incluindo set-cookie)
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })

    const body = await response.text()

    return res.status(response.status).send(body)
  }
}