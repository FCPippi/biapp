/* eslint-disable prettier/prettier */
import { PrismaService } from '../prisma/prisma.service';
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import * as fs from 'fs';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post('/login')
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const user = await this.prisma.user.findFirst({
      where: { email, isDeleted: false },
    });

    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Credenciais inválidas!');
    }

    const validatePassword = await compare(password, user.password);

    if (!validatePassword) {
      throw new UnauthorizedException('Credenciais inválidas!');
    }

    const accessToken = this.jwtService.sign(
      {
        sub: user,
      },

      {
        secret: fs.readFileSync('./keys/private_key.pem', 'utf-8'),
      },
    );

    return { access_token: accessToken };
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    const { refreshToken } = body;

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: fs.readFileSync(
          './keys/private_key.pem',
          'utf-8',
        ),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user || user.isDeleted) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.jwtService.sign(
        { sub: user.id },
        {
          expiresIn: '1h',
          secret: fs.readFileSync(
            './keys/private_key.pem',
            'utf-8',
          ),
        },
      );

      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
