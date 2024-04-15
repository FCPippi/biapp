import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { JobPostsService } from './jobPosts.service';
import { CreateJobPostDtoSchema } from './dto/create-jobPost.dto';
import { UserLogged } from 'src/users/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Graduation } from '@prisma/client';
import { UpdateJobPostDtoSchema } from './dto/update-jobPost.dto';

@ApiBearerAuth()
@Controller('job-posts')
export class JobPostsController {
  constructor(private readonly jobsService: JobPostsService) {}

  @Post()
  async create(
    @UserLogged('id') userId: string,
    @UserLogged('graduation') userCurso: Graduation,
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
