import {
  Controller,
  Param,
  Delete,
  UseGuards,
  Put,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from './guards/admin.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Delete('/users/:id')
  async deleteUser(@Param('id') studentId: string) {
    return await this.adminService.deleteUser(studentId);
  }

  @Put('/users/:id/admin')
  async setAdmin(@Param('id') userId: string) {
    return await this.adminService.setAdmin(userId);
  }

  @Get('/users')
  async getAllUsersInfo(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return await this.adminService.getAllUserInfo(page, limit);
  }

  @Get('/reports/users')
  async getUserReports() {
    return await this.adminService.getUserReports();
  }

  // Adiciona um novo endpoint para buscar jobPosts reportados
  @Get('/reports/jobPosts')
  async getJobPostReports() {
    return await this.adminService.getJobPostReports();
  }

  // Adiciona um novo endpoint para buscar jobRequests reportados
  @Get('/reports/jobRequests')
  async getJobRequestReports() {
    return await this.adminService.getJobRequestReports();
  }
}
