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

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/login')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: { email },
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
        sub: user.id,
      },
      {
        expiresIn: '1h', // Token expira após 1 hora
      },
    );
    return { access_token: accessToken, user_role: user.role };
  }
}
