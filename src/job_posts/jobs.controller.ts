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
import { JobsService } from './jobs.service';
import { CreateJobDtoSchema } from './dto/create-job.dto';
import { UserLogged } from 'src/users/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Curso } from '@prisma/client';
import { UpdateJobDtoSchema } from './dto/update-job.dto';

@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async getJobs(
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
    return this.jobsService.findMany(params);
  }

  @Post()
  create(
    @UserLogged('id') userId: string,
    @UserLogged('curso') userCurso: Curso,
    @Body() createJobDto: CreateJobDtoSchema,
  ) {
    return this.jobsService.create(userId, userCurso, createJobDto);
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
  remove(@UserLogged('id') userId: string, @Param('id') id: string) {
    return this.jobsService.remove(userId, id);
  }

  @Put(':id')
  updateJob(
    @UserLogged('id') userId: string,
    @Param('id') jobId: string,
    @Body() updateJobDto: UpdateJobDtoSchema,
  ) {
    return this.jobsService.updateJob(userId, jobId, updateJobDto);
  }
}
