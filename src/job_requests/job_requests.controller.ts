import { Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { JobRequestsService } from './job_requests.service';
import { UserLogged } from 'src/users/decorators/user.decorator';
import { CreateJobRequestDtoSchema } from './dto/create-job-request.dto';

@Controller('job-requests')
export class JobRequestsController {
  constructor(private readonly jobRequestsService: JobRequestsService) {}

  @Get()
  async getJobPosts(
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('take', ParseIntPipe) take?: number,
    @Query('cursor') cursor?: string,
    @Query('where') where?: string,
    @Query('orderBy') orderBy?: string,
  ) {
    const params = {
      skip,
      take,
      cursor: cursor ? JSON.parse(cursor) : undefined,
      where: where ? JSON.parse(where) : undefined,
      orderBy: orderBy ? JSON.parse(orderBy) : undefined,
    };
    return await this.jobRequestsService.findMany(params);
  }
  @Post()
  async create(
    @UserLogged('id') studentId: string,
    createJobRequestDto: CreateJobRequestDtoSchema,
  ) {
    return await this.jobRequestsService.create(studentId, createJobRequestDto);
  }
}
