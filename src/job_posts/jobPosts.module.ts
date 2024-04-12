import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JobPostsService } from './jobPosts.service';
import { JobPostsController } from './jobPosts.controller';
import { AuthMiddleware } from 'src/shared/auth/auth.middleware';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [JobPostsController],
  providers: [JobPostsService, UsersService],
})
export class JobPostsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'job-posts/*', method: RequestMethod.POST },
        { path: 'job-posts/*', method: RequestMethod.PUT },
      );
  }
}
