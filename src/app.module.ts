import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { JobsModule } from './job_posts/jobPosts.module';
import { ChatGateway } from './chat/chat.gateway';
import { JobRequestsModule } from './job_requests/job_requests.module';

@Module({
  imports: [UsersModule, JobsModule, JobRequestsModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
