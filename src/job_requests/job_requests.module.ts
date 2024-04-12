import { Module } from '@nestjs/common';
import { JobRequestsService } from './job_requests.service';
import { JobRequestsController } from './job_requests.controller';

@Module({
  controllers: [JobRequestsController],
  providers: [JobRequestsService],
})
export class JobRequestsModule {}
