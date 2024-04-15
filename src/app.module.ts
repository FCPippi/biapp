import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { JobPostsModule } from './job_posts/jobPosts.module';
import { JobRequestsModule } from './job_requests/jobRequests.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './shared/auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    UsersModule,
    JobPostsModule,
    JobRequestsModule,
    ChatModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
