import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateJobDtoSchema } from './dto/create-job.dto';
import { UpdateJobDtoSchema } from './dto/update-job.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Curso, JobPost, Prisma } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}
  async create(idAluno: string, curso: Curso, body: CreateJobDtoSchema) {
    const { descricao, valor } = body;

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
    const jobs = await this.prisma.jobPost.findMany({where: {isClosed: false}});
    return jobs;
  }

  async findOne(idJob: string): Promise<JobPost> {
    const job = await this.prisma.jobPost.findUnique({ where: { id: idJob, isClosed: false } });
    if (!job) {
      throw new HttpException('Job não encontrado', HttpStatus.BAD_REQUEST);
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

    const whereWithIsClosedFalse = {
      ...where,
      isClosed: false,
    };

    return await this.prisma.jobPost.findMany({
      skip,
      take,
      cursor,
      where: whereWithIsClosedFalse,
      orderBy,
    });
  }

  async remove(userId: string, idJob: string): Promise<JobPost> {
    const job = await this.prisma.jobPost.findUnique({
      where: { id: idJob },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID "${idJob}" not found`);
    }

    if (job.idAluno !== userId) {
      throw new UnauthorizedException(
        "You don't have permission to update this job",
      );
    }
    return this.prisma.jobPost.update({
      where: job,
      data: {
        isClosed: true,
      },
    });
  }

  async updateJob(
    userId: string,
    jobId: string,
    updateJobDto: UpdateJobDtoSchema,
  ) {
    const job = await this.prisma.jobPost.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID "${jobId}" not found`);
    }

    if (job.idAluno !== userId) {
      throw new UnauthorizedException(
        "You don't have permission to update this job",
      );
    }

    return this.prisma.jobPost.update({
      where: { id: jobId },
      data: updateJobDto,
    });
  }
}
