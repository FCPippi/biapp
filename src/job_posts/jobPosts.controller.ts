import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { JobPostsService } from './jobPosts.service';
import { CreateJobPostDtoSchema } from './dto/create-jobPost.dto';
import { UserLogged } from 'src/users/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Graduation } from '@prisma/client';
import { UpdateJobPostDtoSchema } from './dto/update-jobPost.dto';

@ApiBearerAuth()
@Controller('job-posts')
export class JobPostsController {
  constructor(private readonly jobPostsService: JobPostsService) {}

  @Post()
  async create(
    @UserLogged('id') studentId: string,
    @UserLogged('graduation') userCurso: Graduation,
    @Body() createJobPostDto: CreateJobPostDtoSchema,
  ) {
    return await this.jobPostsService.create(
      studentId,
      userCurso,
      createJobPostDto,
    );
  }

  @Get()
  async getJobRequests(
    @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
    @Query('cursor') cursor?: string,
    @Query('where') where?: string,
    @Query('orderBy') orderBy?: string,
  ) {
    const defaultSkip = 0;
    const defaultTake = 10;

    const params = {
      skip: skip ?? defaultSkip,
      take: take ?? defaultTake,
      cursor: cursor ? JSON.parse(cursor) : undefined,
      where: where ? this.parseWhereParam(where) : undefined,
      orderBy: orderBy ? JSON.parse(orderBy) : undefined,
    };
    return await this.jobPostsService.findMany(params);
  }

  private parseWhereParam(where: string): any {
    const whereObj = JSON.parse(where);
    return { ...whereObj, isClosed: false };
  }

  @Get('/all')
  async getAll() {
    return await this.jobPostsService.findMany({});
  }

  @Put(':id')
  async remove(@UserLogged('id') studentId: string, @Param('id') id: string) {
    return await this.jobPostsService.remove(studentId, id);
  }

  @Put(':id')
  async updateJob(
    @UserLogged('id') studentId: string,
    @Param('id') jobId: string,
    @Body() updateJobPostDto: UpdateJobPostDtoSchema,
  ) {
    return await this.jobPostsService.updateJob(
      studentId,
      jobId,
      updateJobPostDto,
    );
  }
}
