import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  Put,
} from '@nestjs/common';
import { JobsService } from './jobPosts.service';
import { CreateJobPostDtoSchema } from './dto/create-jobPost.dto';
import { UserLogged } from 'src/users/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Graduation } from '@prisma/client';
import { UpdateJobPostDtoSchema } from './dto/update-jobPost.dto';

@ApiBearerAuth()
@Controller('job-posts')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

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
    return await this.jobsService.findMany(params);
  }

  @Post()
  async create(
    @UserLogged('id') userId: string,
    @UserLogged('curso') userCurso: Graduation,
    @Body() createJobPostDto: CreateJobPostDtoSchema,
  ) {
    return await this.jobsService.create(userId, userCurso, createJobPostDto);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Put(':id')
  async remove(@UserLogged('id') userId: string, @Param('id') id: string) {
    return await this.jobsService.remove(userId, id);
  }

  @Put(':id')
  async updateJob(
    @UserLogged('id') userId: string,
    @Param('id') jobId: string,
    @Body() updateJobPostDto: UpdateJobPostDtoSchema,
  ) {
    return await this.jobsService.updateJob(userId, jobId, updateJobPostDto);
  }
}
