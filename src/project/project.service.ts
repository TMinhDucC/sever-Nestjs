import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class ProjectService {

  constructor(@InjectModel(Project.name) private ProjectModel: SoftDeleteModel<ProjectDocument>) { }

  async create(createProjectDto: CreateProjectDto, user: IUser) {
    const { name, tasks, members, FileUrlDocument } = createProjectDto
    return await this.ProjectModel.create({
      name, tasks, members, FileUrlDocument,
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

    const totalItems = (await this.ProjectModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.ProjectModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort as any)
      .populate(population)
      .select(projection as any)  
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
    return await this.ProjectModel.findOne({ _id: id })
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, user: IUser) {
    return await this.ProjectModel.updateOne(
      { _id: id },
      {
        ...updateProjectDto,
        updatedBy: {
          id: user.id,
          email: user.email
        }


      })
  }

  async remove(id: string, user: IUser) {
    await this.ProjectModel.updateOne({ _id: id }, {

      deletedBy:
      {
        id: user.id,
        email: user.email
      }

    })
    return await this.ProjectModel.softDelete({ _id: id })
  }
  
}
