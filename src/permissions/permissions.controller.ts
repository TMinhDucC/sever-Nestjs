import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { User } from 'src/decorator/user.decorator';
import { IUser } from 'src/users/user.interface';
import { ResponseMessage } from 'src/decorator/responMessage';
import { Public } from 'src/decorator/public';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage("create a permission")
  async create(@Body() createPermissionDto: CreatePermissionDto,@User() user:IUser) {
    return await this.permissionsService.create(createPermissionDto,user);
  }

  @Get()
  @Public()
  @ResponseMessage("fetch permission with pagition")
  async findAll(@Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string
  ) {
    return await this.permissionsService.findAll(qs, +page, +limit);
  }

  @Get(':id')
  @Public()
  @ResponseMessage("fetch permission by id")
  async findOne(@Param('id') id: string) {
    return await this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("update permission by id")
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto,@User() user:IUser) {
    return await this.permissionsService.update(id, updatePermissionDto,user);
  }

  @Delete(':id')
  @ResponseMessage("delete permission by id")
  async remove(@Param('id') id: string,@User() user:IUser) {
    return await this.permissionsService.remove(id,user);
  }
}
