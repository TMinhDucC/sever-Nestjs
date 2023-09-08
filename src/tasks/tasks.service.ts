import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private TaskModel: SoftDeleteModel<TaskDocument>) { }

  async create(createTaskDto: CreateTaskDto, user: IUser) {
    const { title, name, status } = createTaskDto

    return await this.TaskModel.create({
      title, name, status,
      createdBy: {
        id: user.id,
        email: user.email

      }

    })
  }
  async findAll(qs: string, page: number, limit: number) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current
    delete filter.pageSize

    let offset = (page - 1) * (limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.TaskModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.TaskModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort as any)
      .populate(population)
      .select("-password")  //khong hien thi pass cho client
      .exec();

    return {
      meta: {
        current: page, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    return await this.TaskModel.findOne({ _id: id })
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: IUser) {
    return await this.TaskModel.updateOne(
      { _id: id },
      {
        ...updateTaskDto,
        updatedBy: {
          id: user.id,
          email: user.email
        }

      })
  }

  async remove(id: string, user: IUser) {
    await this.TaskModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          id: user.id,
          email: user.email
        }

      })
    return await this.TaskModel.softDelete({ _id: id })
  }
}
