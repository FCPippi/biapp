import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JobRequestsService } from './jobRequests.service';
import { JobRequestsController } from './jobRequests.controller';
import { AuthMiddleware } from 'src/shared/auth/auth.middleware';

@Module({
  controllers: [JobRequestsController],
  providers: [JobRequestsService],
})
export class JobRequestsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'job-requests/*', method: RequestMethod.POST },
        { path: 'job-requests/*', method: RequestMethod.PUT },
      );
  }}
