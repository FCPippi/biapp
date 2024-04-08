import { Injectable } from '@nestjs/common';
import { CreateJobDtoSchema } from './dto/create-job.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';


@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}
  async create(idAluno: string, body: CreateJobDtoSchema) {
    const { descricao, valor } = body;
    
    const job = await this.prisma.jobPost.create({
      data: { idAluno, descricao, valor }
    });

    await this.prisma.user.update({
      where: { id: idAluno },
      data: { 
        jobPosts: {
          connect: { id: job.id } 
        }
      }
    });
  }

  findAll() {
    return `This action returns all jobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
