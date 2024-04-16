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

  async getUserReports() {
    const userReports = await this.prisma.report.findMany({
      where: { reportedType: 'user' },
    });
  
    const users = await Promise.all(userReports.map(async (report) => {
      return await this.prisma.user.findUnique({
        where: { id: report.reportedId },
      });
    }));
  
    return users.filter(user => user !== null);
  }

  async getJobPostReports() {
    const jobPostReports = await this.prisma.report.findMany({
      where: { reportedType: 'jobPost' },
    });
  
    const jobPosts = await Promise.all(jobPostReports.map(async (report) => {
      return await this.prisma.jobPost.findUnique({
        where: { id: report.reportedId },
      });
    }));
  
    return jobPosts.filter(jobPost => jobPost !== null);
  }

  async getJobRequestReports() {
    const jobRequestReports = await this.prisma.report.findMany({
      where: { reportedType: 'jobRequest' },
    });
  
    const jobRequests = await Promise.all(jobRequestReports.map(async (report) => {
      return await this.prisma.jobRequest.findUnique({
        where: { id: report.reportedId },
      });
    }));
  
    return jobRequests.filter(jobRequest => jobRequest !== null);
  }
}
