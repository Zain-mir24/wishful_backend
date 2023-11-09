import { Injectable, NestMiddleware ,HttpException,HttpStatus} from '@nestjs/common';
import { Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      let authToken = req.headers.authorization;
        jwt.verify(authToken, process.env.SECRET_KEY);
      next();
    } catch (e) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
