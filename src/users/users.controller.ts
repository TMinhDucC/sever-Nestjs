import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, RegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/decorator/user.decorator';
import { IUser } from './user.interface';
import { ResponseMessage } from 'src/decorator/responMessage';
import { Request, Response } from 'express';
import { Public } from 'src/decorator/public';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post("logout")
  @ResponseMessage("ok logout")
  async logOut(@User() user: IUser, @Res({ passthrough: true }) response: Response, @Req() request: Request) {

    return await this.usersService.logOutUser(user, response);
  }

  @Post()
  @ResponseMessage("create a user")
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {

    return await this.usersService.create(createUserDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("fetch user with pagition")
  async findAll(@Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string
  ) {
    return await this.usersService.findAll(qs, +page, +limit);
  }

  @Get(':id')
  @ResponseMessage("fetch user by id")
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("update user by id")
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return await this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage("delete user by id")
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.usersService.remove(id, user);
  }

  @Post("register")
  @ResponseMessage("ok register")
  async register(@Body() registerDto: RegisterDto, @User() user: IUser) {

    return await this.usersService.registerUser(registerDto);
  }


}
