import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { User } from 'src/decorator/user.decorator';
import { IUser } from 'src/users/user.interface';
import { Public } from 'src/decorator/public';
import { ResponseMessage } from 'src/decorator/responMessage';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage("create a role")
  async create(@Body() createRoleDto: CreateRoleDto, @User() user:IUser) {
    return await this.rolesService.create(createRoleDto,user);
  }

  @Get()
  @Public()
  @ResponseMessage("fetch role with pagition")
  findAll(@Query('current') page: string,
  @Query('pageSize') limit: string,
  @Query() qs: string) {
    return this.rolesService.findAll(qs, +page, +limit);
  }

  @Get(':id')
  @Public()
  @ResponseMessage("fetch role by id")
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("update Role by id")
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto,@User() user:IUser) {
    return await this.rolesService.update(id, updateRoleDto,user);
  }

  @Delete(':id')
  @ResponseMessage("delete project by id")
  async remove(@Param('id') id: string,@User() user:IUser) {
    return await this.rolesService.remove(id,user);
  }
}
