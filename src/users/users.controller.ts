import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
  Put,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
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
  @Post('/rating')
  async rateUser(
    @UserLogged('id') userFrom: string,
    @Body() rateUserDto: RateAccountDtoSchema,
  ) {
    return await this.userService.rateUser(userFrom, rateUserDto);
  }

  @Post()
  async create(@Body() createUserDto: CreateAccountDtoSchema) {
    return await this.userService.create(createUserDto);
  }

  @Put()
  async updateUser(
    @UserLogged('id') userId: string,
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
      userId,
      updateUserDto,
      file.buffer.toString(),
    );
  }

  @Put('/delete')
  async deleteUser(@UserLogged('id') userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
