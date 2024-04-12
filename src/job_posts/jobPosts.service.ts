import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateJobPostDtoSchema } from './dto/create-jobPost.dto';
import { UpdateJobPostDtoSchema } from './dto/update-jobPost.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Graduation, JobPost, Prisma } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}
  async create(
    studentId: string,
    graduation: Graduation,
    createJobDto: CreateJobPostDtoSchema,
  ): Promise<JobPost> {
    const { title, description, value } = createJobDto;

    const job = await this.prisma.jobPost.create({
      data: { studentId, title, description, value, graduation },
    });

    return job;
  }

  async findAll(): Promise<JobPost[]> {
    const jobs = await this.prisma.jobPost.findMany({
      where: { isClosed: false },
    });
    return jobs;
  }

  async findOne(idJob: string): Promise<JobPost> {
    const job = await this.prisma.jobPost.findUnique({
      where: { id: idJob, isClosed: false },
    });
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

    where.isClosed = false;

    return await this.prisma.jobPost.findMany({
      skip,
      take,
      cursor,
      where,
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

    if (job.studentId !== userId) {
      throw new UnauthorizedException(
        "You don't have permission to update this job",
      );
    }
    return await this.prisma.jobPost.update({
      where: job,
      data: {
        isClosed: true,
      },
    });
  }

  async updateJob(
    userId: string,
    jobId: string,
    updateJobDto: UpdateJobPostDtoSchema,
  ) {
    const job = await this.prisma.jobPost.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID "${jobId}" not found`);
    }

    if (job.studentId !== userId) {
      throw new UnauthorizedException(
        "You don't have permission to update this job",
      );
    }

    return await this.prisma.jobPost.update({
      where: { id: jobId },
      data: updateJobDto,
    });
  }
}
