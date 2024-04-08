import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAccountDtoSchema } from './dto/create-user.dto';
import { UserLogged } from './decorators/user.decorator';

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

  @Post()
  async create(@Body() createUserDto: CreateAccountDtoSchema) {
    return this.userService.create(createUserDto);
  }

  @Post('/rating')
  async rateUser(
    @UserLogged('id') userFrom: string,
    userTo: string,
    value: number,
  ) {
    return this.userService.rateUser(userFrom, userTo, Math.floor(value));
  }
}
