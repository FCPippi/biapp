import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
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
        { path: 'jobs/*', method: RequestMethod.POST },
        { path: 'jobs/*', method: RequestMethod.PUT },
        { path: 'jobs/*', method: RequestMethod.DELETE },
      );
  }
}
