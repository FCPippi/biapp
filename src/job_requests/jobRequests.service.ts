import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateJobRequestDtoSchema } from './dto/create-job-request.dto';
import { JobRequest, Prisma } from '@prisma/client';

@Injectable()
export class JobRequestsService {
  constructor(private prisma: PrismaService) {}
  async create(
    studentId: string,
    createJobRequestDto: CreateJobRequestDtoSchema,
  ) {
    const { title, description, graduation } = createJobRequestDto;

    const jobRequest = await this.prisma.jobRequest.create({
      data: { studentId, title, description, graduation },
    });

    return jobRequest;
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.JobRequestWhereUniqueInput;
    where?: Prisma.JobRequestWhereInput;
    orderBy?: Prisma.JobRequestOrderByWithRelationInput;
  }): Promise<JobRequest[]> {
    const { skip, take, cursor, where, orderBy } = params;

    where.isClosed = false;

    return await this.prisma.jobRequest.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findAll() : Promise<JobRequest[]> {
    return await this.prisma.jobRequest.findMany();
  }

  async remove(studentId:string,idJob:string):Promise<JobRequest> {

    const job = await this.prisma.jobRequest.findUnique({
      where: { id: idJob },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID "${idJob}" not found`);
    }

    if (job.studentId !== studentId) {
      throw new UnauthorizedException(
        "You don't have permission to update this job",
      );
    }
    return await this.prisma.jobRequest.update({
      where: job,
      data: {
        isClosed: true,
      },
    });
  }
}
