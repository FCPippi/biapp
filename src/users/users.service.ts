import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { CreateAccountDtoSchema } from './dto/create-user.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(body: CreateAccountDtoSchema) {
    const { name, email, password, birthdate, curso, gender } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException('Usuário já cadastrado!');
    }

    const encryptedPassword = await hash(password, 8);

    const birthdateToDateTime = new Date(birthdate).toISOString();

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: encryptedPassword,
        birthdate: birthdateToDateTime,
        curso,
        gender,
      },
    });
  }

  async findById(userId: string) {
    const user = this.prisma.user.findUnique({ where: { id: userId } });
    return user;
  }
}
