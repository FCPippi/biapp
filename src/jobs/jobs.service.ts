import { HttpException, HttpStatus, Injectable, Response } from '@nestjs/common';
import { CreateJobDtoSchema } from './dto/create-job.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}
  async create(idAluno: string, body: CreateJobDtoSchema) {
    const { descricao, valor, curso } = body;

    const job = await this.prisma.jobPost.create({
      data: { idAluno, descricao, valor, curso },
    });

    await this.prisma.user.update({
      where: { id: idAluno },
      data: {
        jobPosts: {
          connect: { id: job.id },
        },
      },
    });
  }

  async findAll() {
    const jobs = await this.prisma.user.findMany();
    return jobs;
  }

  async findOne(idAluno: string) : Promise<User> { 
    const user = await this.prisma.user.findUnique({where: {id: idAluno}});
    if (!user) {
      throw new HttpException("Usuário não encontrado",HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async remove(idAluno: string) : Promise<User> {
    const user = await this.findOne(idAluno) as Prisma.UserWhereUniqueInput;
    return this.prisma.user.delete({where: user})
  }
}
