import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JobsService } from './jobPosts.service';
import { JobsController } from './jobPosts.controller';
import { AuthMiddleware } from 'src/shared/auth/auth.middleware';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
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
