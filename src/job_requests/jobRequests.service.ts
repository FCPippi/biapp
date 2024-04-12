import { Injectable } from '@nestjs/common';
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
}
