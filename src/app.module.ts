import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { JobPostsModule } from './job_posts/jobPosts.module';
import { ChatGateway } from './chat/chat.gateway';
import { JobRequestsModule } from './job_requests/jobRequests.module';
import { ChatModule } from './chat/chat.module';
import { AuthController } from './shared/auth/auth.controller';
import { AuthModule } from './shared/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    JobPostsModule,
    JobRequestsModule,
    ChatModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
