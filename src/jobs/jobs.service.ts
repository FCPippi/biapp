import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobDtoSchema } from './dto/create-job.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JobPost, Prisma } from '@prisma/client';

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
    const jobs = await this.prisma.jobPost.findMany();
    return jobs;
  }

  async findOne(idJob: string) : Promise<JobPost> { 
    const job = await this.prisma.jobPost.findUnique({where: {id: idJob}});
    if (!job) {
      throw new HttpException("Usuário não encontrado",HttpStatus.BAD_REQUEST);
    }
    return job;
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.JobPostWhereUniqueInput;
    where?: Prisma.JobPostWhereInput;
    orderBy?: Prisma.JobPostOrderByWithRelationInput;
  }): Promise<JobPost[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.jobPost.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async remove(idJob: string) : Promise<JobPost> {
    const job = await this.findOne(idJob) as Prisma.JobPostWhereUniqueInput;
    return this.prisma.jobPost.delete({where: job})
  }
}
