import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [
    UsersModule,
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      useFactory() {
        return {
          signOptions: { algorithm: 'RS256', expiresIn: '8h' },
          privateKey: fs.readFileSync('./keys/private_key.pem', 'utf8'),
          publicKey: fs.readFileSync('./keys/public_key.pem', 'utf8'),
        };
      },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
