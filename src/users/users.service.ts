import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { CreateAccountDtoSchema } from './dto/create-user.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Prisma, Rating, User } from '@prisma/client';
import { UpdateAccountDtoSchema } from './dto/update-user.dto';
import { RateAccountDtoSchema } from './dto/rate-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createAccountDto: CreateAccountDtoSchema): Promise<User> {
    const { name, email, password, birthdate, graduation, gender } =
      createAccountDto;
    const confirmationToken = uuidv4();

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail && !userWithSameEmail.isDeleted) {
      throw new ConflictException('Usuário já cadastrado!');
    }

    const encryptedPassword = await hash(password, 8);

    const birthdateToDateTime = new Date(birthdate);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: encryptedPassword,
        birthdate: birthdateToDateTime,
        graduation,
        gender,
      },
    });

    return user;
  }

  /* async confirmEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { confirmationToken: token },
    });

    if (!user) {
      throw new NotFoundException('Token inválido');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        confirmationToken: null,
      },
    });
  } */

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;

    const whereClause: Prisma.UserWhereInput = {
      ...where,
      isDeleted: false,
    };

    return await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where: whereClause,
      orderBy,
    });
  }

  async findById(userId: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
    });
    if (!user) {
      throw new HttpException('User não encontrado', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateAccountDtoSchema,
    imageUrl?: string,
  ): Promise<User> {
    const user = await this.findById(userId);

    const { name, birthdate, graduation, gender } = updateUserDto;

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { name, birthdate, graduation, gender, imageUrl },
    });

    return updatedUser;
  }

  async rateUser(
    authorId: string,
    rateUserDto: RateAccountDtoSchema,
  ): Promise<Rating> {
    const { recipientId, value, comment } = rateUserDto;

    if (authorId === recipientId) {
      throw new HttpException(
        'Um usuário não pode se avaliar.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const rating = await this.prisma.rating.create({
      data: {
        authorId,
        recipientId,
        value,
        comment,
      },
    });

    return rating;
  }

  async deleteUser(userId: string) {
    const user = await this.findById(userId);

    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isDeleted: true,
      },
    });
  }
}
