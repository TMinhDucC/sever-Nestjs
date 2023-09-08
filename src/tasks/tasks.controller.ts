import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/decorator/user.decorator';
import { IUser } from 'src/users/user.interface';
import { ResponseMessage } from 'src/decorator/responMessage';
import { Public } from 'src/decorator/public';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @ResponseMessage("create a task")
  async create(@Body() createTaskDto: CreateTaskDto, @User() user: IUser) {
    return await this.tasksService.create(createTaskDto, user)
  }

  @Get()
  @Public()
  @ResponseMessage("fetch task with pagition")
  async findAll(@Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string
  ) {
    return await this.tasksService.findAll(qs, +page, +limit);
  }

  @Get(':id')
  @ResponseMessage("fetch task by id")
  async findOne(@Param('id') id: string) {
    return await this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("update task by id")
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @User() user: IUser) {
    return await this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @ResponseMessage("delete task")
  async remove(@Param('id') id: string,@User() user: IUser) {
    return await this.tasksService.remove(id,user);
  }
}
