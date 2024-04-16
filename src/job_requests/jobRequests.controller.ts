import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { JobRequestsService } from './jobRequests.service';
import { UserLogged } from 'src/users/decorators/user.decorator';
import { CreateJobRequestDtoSchema } from './dto/create-job-request.dto';

@Controller('job-requests')
export class JobRequestsController {
  constructor(private readonly jobRequestsService: JobRequestsService) {}

  @Get()
  async getJobRequests(
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

  @Get('/all')
  async getAllJobRequests() {
    return await this.jobRequestsService.findAll();
  }

  @Post()
  async create(
    @UserLogged('id') studentId: string,
    createJobRequestDto: CreateJobRequestDtoSchema,
  ) {
    return await this.jobRequestsService.create(studentId, createJobRequestDto);
  }

  @Patch(':id')
  async remove(@UserLogged('id') studentId: string, @Param('id') id: string) {
    return await this.jobRequestsService.remove(studentId, id);
  }
}
