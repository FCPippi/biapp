import { Injectable, NotFoundException } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async deleteUser(studentId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: studentId },
    });
    await this.prisma.user.delete({ where: { id: user.id } });
    return user;
  }

  async setAdmin(studentId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${studentId} não encontrado`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { role: Role.ADMIN },
    });

    return updatedUser;
  }

  async getAllUserInfo() {
    return await this.prisma.user.findMany({
      include: {
        ratingsGiven: true,
        ratingsReceived: true,
        jobPosts: true,
        jobRequests: true,
      },
    });
  }
}
