import { Controller, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from './guards/admin,guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  
}
