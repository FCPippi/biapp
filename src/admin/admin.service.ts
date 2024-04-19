import { Injectable, NotFoundException } from '@nestjs/common';
import { Gender, Graduation, Role, User } from '@prisma/client';
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

  async getAllUserInfo(
    page: number,
    limit: number,
    name?: string,
    email?: string,
    graduation?: Graduation,
    gender?: Gender,
    role?: Role,
    isDeleted?: boolean,
    emailVerified?: boolean,
  ) {
    const skip = (page - 1) * limit;
    return await this.prisma.user.findMany({
      take: limit,
      skip: skip,
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        email: email ? { equals: email, mode: 'insensitive' } : undefined,
        graduation: graduation ? graduation : undefined,
        gender: gender ? gender : undefined,
        role: role ? role : undefined,
        isDeleted: isDeleted !== undefined ? isDeleted : undefined,
        emailVerified: emailVerified !== undefined ? emailVerified : undefined,
      },
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

    const usersWithReports = await Promise.all(
      userReports.map(async (report) => {
        const user = await this.prisma.user.findUnique({
          where: { id: report.reportedId },
        });
        return user ? { user, reportDetails: report } : null;
      }),
    );

    return usersWithReports.filter((userWithReport) => userWithReport !== null);
  }

  async getJobPostReports() {
    const jobPostReports = await this.prisma.report.findMany({
      where: { reportedType: 'jobPost' },
    });

    const jobPostsWithReports = await Promise.all(
      jobPostReports.map(async (report) => {
        const jobPost = await this.prisma.jobPost.findUnique({
          where: { id: report.reportedId },
        });
        return jobPost ? { jobPost, reportDetails: report } : null;
      }),
    );

    return jobPostsWithReports.filter(
      (jobPostWithReport) => jobPostWithReport !== null,
    );
  }

  async getJobRequestReports() {
    const jobRequestReports = await this.prisma.report.findMany({
      where: { reportedType: 'jobRequest' },
    });

    const jobRequestsWithReports = await Promise.all(
      jobRequestReports.map(async (report) => {
        const jobRequest = await this.prisma.jobRequest.findUnique({
          where: { id: report.reportedId },
        });
        return jobRequest ? { jobRequest, reportDetails: report } : null;
      }),
    );

    return jobRequestsWithReports.filter(
      (jobRequestWithReport) => jobRequestWithReport !== null,
    );
  }
}
