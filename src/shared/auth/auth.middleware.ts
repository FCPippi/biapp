import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { ModuleRef } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private userService: UsersService;
  constructor(private readonly moduleRef: ModuleRef) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const privateKey = fs.readFileSync('./keys/private_key.pem', 'utf-8');
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded: any = jwt.verify(token, privateKey);
      this.userService = this.moduleRef.get(UsersService, { strict: false });
      const user = await this.userService.loadUserInfo(decoded.id);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }

      req.user = user;
      next();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
