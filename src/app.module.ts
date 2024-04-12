import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { JobPostsModule } from './job_posts/jobPosts.module';
import { ChatGateway } from './chat/chat.gateway';
import { JobRequestsModule } from './job_requests/jobRequests.module';

@Module({
  imports: [UsersModule, JobPostsModule, JobRequestsModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
