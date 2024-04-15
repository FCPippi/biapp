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
  findAll() {
    return this.jobPostsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobPostsService.findOne(id);
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
