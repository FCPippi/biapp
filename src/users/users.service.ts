import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { CreateAccountDtoSchema } from './dto/create-user.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Prisma, Rating, User } from '@prisma/client';

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

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findById(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if(!user) {
      throw new HttpException('User não encontrado', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async rateUser(authorId: string, recipientId: string, value: number): Promise<Rating> {
    // Verifica se o autor e o receptor são o mesmo usuário
    if (authorId === recipientId) {
      throw new Error("Um usuário não pode se avaliar.");
    }

    // Cria a avaliação no banco de dados
    const rating = await this.prisma.rating.create({
      data: {
        authorId,
        recipientId,
        value,
      },
    });

    const userGiven = await this.prisma.user.update({
      where: { id: recipientId },
      data: {
        ratingsReceived: {
          connect: { id: rating.id }, // Supondo que `ratingId` é o ID da nova avaliação
        },
      },
    });

    const userRating = await this.prisma.user.update({
      where: { id: recipientId },
      data: {
        ratingsGiven: {
          connect: { id: rating.id }, // Supondo que `ratingId` é o ID da nova avaliação
        },
      },
    })

    return rating;
  }
  
}
