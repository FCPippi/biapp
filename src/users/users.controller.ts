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
      skip,
      take,
      cursor: cursor ? JSON.parse(cursor) : undefined,
      where: where ? JSON.parse(where) : undefined,
      orderBy: orderBy ? JSON.parse(orderBy) : undefined,
    };
    return this.userService.findMany(params);
  }

  @Post('/rating')
  async rateUser(
    @UserLogged('id') userFrom: string,
    @Body() rateUserDto: RateAccountDtoSchema,
  ) {
    return this.userService.rateUser(userFrom, rateUserDto);
  }

  @Post()
  async create(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'jpeg',
      })
      .addMaxSizeValidator({
        maxSize: 1000
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
  )
  file: Express.Multer.File,@Body() createUserDto: CreateAccountDtoSchema,) {
    return this.userService.create(file.buffer.toString(),createUserDto);
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
          maxSize: 1000
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
    )
    file?: Express.Multer.File,
  ) {
    this.userService.updateUser(userId, updateUserDto,file.buffer.toString());
  }

  @Put('/delete')
  async deleteUser(@UserLogged('id') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
