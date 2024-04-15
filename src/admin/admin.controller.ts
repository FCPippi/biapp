import { Controller, Param, Delete, UseGuards, Patch, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from './guards/admin,guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Delete('/users/:id')
  async deleteUser(@Param('id') studentId: string) {
    return await this.adminService.deleteUser(studentId);
  }
  
  @Patch('/users/:id/admin')
  async setAdmin(@Param('id') userId: string) {
    return await this.adminService.setAdmin(userId);
  }

  @Get('/users') 
  async getAllUsersInfo(){
    return await this.adminService.getAllUserInfo()
  }
}
