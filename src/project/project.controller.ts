import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from 'src/decorator/user.decorator';
import { IUser } from 'src/users/user.interface';
import { ResponseMessage } from 'src/decorator/responMessage';
import { Public } from 'src/decorator/public';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ResponseMessage("create a project")
  async create(@Body() createProjectDto: CreateProjectDto,@User() user:IUser) {
    return await this.projectService.create(createProjectDto,user);
  }

  @Get()
  @Public()
  @ResponseMessage("fetch project with pagition")
  async findAll(@Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string
  ) {
    return await this.projectService.findAll(qs, +page, +limit);
  }

  @Get(':id')
  @Public()
  @ResponseMessage("fetch project by id")
  async findOne(@Param('id') id: string) {
    return await this.projectService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("update project by id")
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto,@User() user:IUser) {
    return await this.projectService.update(id, updateProjectDto,user);
  }

  @Delete(':id')
  @ResponseMessage("delete project by id")
  async remove(@Param('id') id: string,@User() user:IUser) {
    return await this.projectService.remove(id,user);
  }
}
