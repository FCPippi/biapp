import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const token = req.headers.authorization
      ? (req.headers.authorization as string).split(' ')
      : null;

    if (!token || token.length !== 2) {
      throw new UnauthorizedException(
        'Token de autenticação ausente ou inválido',
      );
    }

    try {
      const privateKey = fs.readFileSync('./keys/private_key.pem', 'utf-8');
      const decoded: any = jwt.verify(token[1], privateKey);

      if (decoded.sub.role !== 'ADMIN') {
        throw new UnauthorizedException('Acesso restrito a administradores');
      }

      req.user = decoded.sub;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token de autenticação inválido');
    }
  }
}
