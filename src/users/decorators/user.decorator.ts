import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

export const UserLogged = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    console.log(req.headers.authorization);

    const token = req.headers.authorization
      ? (req.headers.authorization as string).split(' ')
      : null;

    const privateKey = fs.readFileSync('./keys/private_key.pem', 'utf-8');
    const decoded: any = jwt.verify(token[1], privateKey);

    return data ? decoded.sub[data] : decoded.sub.user;
  },
);
