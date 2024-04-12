import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JobPostsService } from './jobPosts.service';
import { JobPostsController } from './jobPosts.controller';
import { AuthMiddleware } from 'src/shared/auth/auth.middleware';

@Module({
  controllers: [JobPostsController],
  providers: [JobPostsService],
})
export class JobsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'job-posts/*', method: RequestMethod.POST },
        { path: 'job-posts/*', method: RequestMethod.PUT },
      );
  }
}
