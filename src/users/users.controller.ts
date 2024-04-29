import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  ParseIntPipe,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Param,
  DefaultValuePipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAccountDtoSchema } from './dto/create-user.dto';
import { UserLogged } from './decorators/user.decorator';
import { RateAccountDtoSchema } from './dto/rate-user.dto';
import { UpdateAccountDtoSchema } from './dto/update-user.dto';
import { ReportDtoSchema } from './dto/report.dto';
import { Gender, Graduation, Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAllUsersInfo(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('graduation') graduation?: Graduation,
    @Query('gender') gender?: Gender,
    @Query('role') role?: Role,
    @Query('isDeleted') isDeleted?: boolean,
    @Query('emailVerified') emailVerified?: boolean,
  ) {
    return await this.userService.findMany(
      page,
      limit,
      name,
      email,
      graduation,
      gender,
      role,
      isDeleted,
      emailVerified,
    );
  }

  @Get('/logged')
  async getLoggedUser(@UserLogged('id') studentId: string) {
    return await this.userService.loadUserInfo(studentId);
  }
  @Post(':recipientId/rating')
  async rateUser(
    @UserLogged('id') userFrom: string,
    @Param('recipientId') recipientId: string,
    @Body() rateUserDto: RateAccountDtoSchema,
  ) {
    return await this.userService.rateUser(userFrom, recipientId, rateUserDto);
  }

  @Post()
  async create(@Body() createUserDto: CreateAccountDtoSchema) {
    return await this.userService.create(createUserDto);
  }

  @Patch()
  async updateUser(
    @UserLogged('id') studentId: string,
    @Body() updateUserDto: UpdateAccountDtoSchema,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 1000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.userService.updateUser(
      studentId,
      updateUserDto,
      file.buffer.toString(),
    );
  }

  @Patch('/delete')
  async deleteUser(@UserLogged('id') studentId: string) {
    return await this.userService.deleteUser(studentId);
  }

  @Post('/report/:reportedType/:reportedId')
  async report(
    @UserLogged('id') reporterId,
    @Param('reportedType') reportedType: string,
    @Param('reportedId') reportedId: string,
    @Body() reason: ReportDtoSchema,
  ) {
    return await this.userService.report(
      reporterId,
      reportedType,
      reportedId,
      reason,
    );
  }
}
