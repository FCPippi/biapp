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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAccountDtoSchema } from './dto/create-user.dto';
import { UserLogged } from './decorators/user.decorator';
import { RateAccountDtoSchema } from './dto/rate-user.dto';
import { UpdateAccountDtoSchema } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUsers(
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('take', ParseIntPipe) take?: number,
    @Query('cursor') cursor?: string,
    @Query('where') where?: string,
    @Query('orderBy') orderBy?: string,
  ) {
    const params = {
      skip: skip ? JSON.parse(cursor) : 0,
      take: take ? JSON.parse(cursor) : 0,
      cursor: cursor ? JSON.parse(cursor) : undefined,
      where: where ? JSON.parse(where) : undefined,
      orderBy: orderBy ? JSON.parse(orderBy) : undefined,
    };
    return await this.userService.findMany(params);
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
    @Body() reason: string,
  ) {
    return await this.userService.report(
      reporterId,
      reportedType,
      reportedId,
      reason,
    );
  }
}
