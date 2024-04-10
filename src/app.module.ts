import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { JobsModule } from './job_posts/jobs.module';

@Module({
  imports: [UsersModule, JobsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
