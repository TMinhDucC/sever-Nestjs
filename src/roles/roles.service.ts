import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class RolesService {

  constructor(@InjectModel(Role.name) private RoleModel: SoftDeleteModel<RoleDocument>) { }
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, permissions, isActive } = createRoleDto
    return await this.RoleModel.create(
      {
        name, permissions, isActive,
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

    const totalItems = (await this.RoleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.RoleModel.find(filter)
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
    return await this.RoleModel.findOne({ _id: id })
    .populate({
      path: "permissions",
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 }
    });

  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    return await this.RoleModel.updateOne(
      { _id: id },
      {
        ...updateRoleDto,
        updatedBy: {
          id: user.id,
          email: user.email
        }


      })
  }

  async remove(id: string, user: IUser) {
    await this.RoleModel.updateOne({ _id: id }, {

      deletedBy:
      {
        id: user.id,
        email: user.email
      }

    })
    return await this.RoleModel.softDelete({ _id: id })
  }
}
