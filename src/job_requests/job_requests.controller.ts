import { Controller, Post } from '@nestjs/common';
import { JobRequestsService } from './job_requests.service';
import { UserLogged } from 'src/users/decorators/user.decorator';
import { CreateJobRequestDtoSchema } from './dto/create-job-request.dto';

@Controller('job-requests')
export class JobRequestsController {
  constructor(private readonly jobRequestsService: JobRequestsService) {}

  @Post()
  async create(
    @UserLogged('id') studentId: string,
    createJobRequestDto: CreateJobRequestDtoSchema,
  ) {
    return await this.jobRequestsService.create(studentId, createJobRequestDto);
  }
}
