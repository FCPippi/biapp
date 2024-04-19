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
import { Prisma, Rating, Report, User } from '@prisma/client';
import { UpdateAccountDtoSchema } from './dto/update-user.dto';
import { RateAccountDtoSchema } from './dto/rate-user.dto';
//import { v4 as uuidv4 } from 'uuid';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createAccountDto: CreateAccountDtoSchema): Promise<User> {
    const { name, email, password, birthdate, graduation, gender } =
      createAccountDto;
    //const confirmationToken = uuidv4();

    const userWithSameEmail = await this.prisma.user.findFirst({
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
  }): Promise<UserInfo[]> {
    const { skip, take, cursor, where, orderBy } = params;
  
    const whereClause: Prisma.UserWhereInput = {
      ...where,
      isDeleted: false,
    };
  
    const users = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where: whereClause,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        birthdate: true,
        graduation: true,
        gender: true,
      }
    });
  
    const usersWithRating = await Promise.all(
      users.map(async (user) => {
        const avgRating = await this.getUserRatingAverage(user.id);
        return { ...user, avgRating };
      })
    );
  
    return usersWithRating;
  }
   

  async loadUserInfo(studentId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: studentId },
      include: {
        ratingsGiven: true,
        ratingsReceived: true,
        jobPosts: true,
        jobRequests: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const avgRating = await this.getUserRatingAverage(studentId);

    return { ...user, avgRating };
  }

  async updateUser(
    studentId: string,
    updateUserDto: UpdateAccountDtoSchema,
    imageUrl?: string,
  ): Promise<User> {
    const user = await this.loadUserInfo(studentId);

    const { name, birthdate, graduation, gender } = updateUserDto;

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { name, birthdate, graduation, gender, imageUrl },
    });

    return updatedUser;
  }

  async rateUser(
    authorId: string,
    recipientId: string,
    rateUserDto: RateAccountDtoSchema,
  ): Promise<Rating> {
    const { value, comment } = rateUserDto;

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

  async getUserRatingAverage(studentId: string): Promise<number> {
    const ratings = await this.prisma.rating.findMany({
      where: { recipientId: studentId },
    });

    if (ratings.length === 0) {
      return 0;
    }

    const sum = ratings.reduce((acc, rating) => acc + rating.value, 0);
    const average = sum / ratings.length;

    return average;
  }

  async deleteUser(studentId: string) {
    const user = await this.loadUserInfo(studentId);

    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email + '-deleted',
        isDeleted: true,
      },
    });
  }

  async report(
    reporterId: string,
    reportedType: string,
    reportedId: string,
    reason: string,
  ): Promise<Report> {
    const report = await this.prisma.report.create({
      data: { reporterId, reportedType, reportedId, reason },
    });
    return report;
  }
}
