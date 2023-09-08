import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private PermissionModel: SoftDeleteModel<PermissionDocument>) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto
    return await this.PermissionModel.create({
      name, apiPath, method, module,
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

    const totalItems = (await this.PermissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.PermissionModel.find(filter)
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
    return await this.PermissionModel.findOne({ _id: id })
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    return await this.PermissionModel.updateOne(
      { _id: id },
      {
        ...updatePermissionDto,
        updatedBy: {
          id: user.id,
          email: user.email
        }


      })
  }

  async remove(id: string, user: IUser) {
    await this.PermissionModel.updateOne({ _id: id }, {

      deletedBy:
      {
        id: user.id,
        email: user.email
      }

    })
    return await this.PermissionModel.softDelete({ _id: id })
  }
}
