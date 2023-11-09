import { Injectable, NestMiddleware ,HttpException,HttpStatus} from '@nestjs/common';
import { Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      let authToken = req.headers.authorization;
       const verify= jwt.verify(authToken, process.env.SECRET_KEY);
     if(verify) next();
    } catch (e) {
      console.log(e)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
