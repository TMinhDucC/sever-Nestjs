import { Injectable, Res } from '@nestjs/common';
import { CreateUserDto, RegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import aqp from 'api-query-params';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import { Response } from 'express';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: SoftDeleteModel<UserDocument>) { }
  async create(createUserDto: CreateUserDto, user: IUser) {
    const { email, password, tasks } = createUserDto

    const hashedPassword = await this.hashPass(password);

    return await this.UserModel.create({
      email,
      password: hashedPassword,
      tasks,
      createdBy: {
        _id: user.id,
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

    const totalItems = (await this.UserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.UserModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .select(projection as any)
      .sort(sort as any)
      .populate(population)
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
    return await this.UserModel.findOne({ _id: id })
      .populate({ path: "role", select: { name: 1, _id: 1 } })
  }

  async findOneByUser(username: string) {
    return await this.UserModel.findOne({ email: username })
      .populate({ path: "role", select: { name: 1 } })
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    return await this.UserModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user.id,
          email: user.email
        }
      })
  }

  async remove(id: string, user: IUser) {
    let result = await this.UserModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user.id,
          email: user.email
        }


      })
    return await this.UserModel.softDelete({ _id: id })

  }

  hashPass = async (pass: string) => {
    const password = pass;
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
  checkPass = async (password: any, hash: string) => {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch
  }

  registerUser = async (registerDto: RegisterDto) => {
    const { email, name, password } = registerDto
    const hashedPassword = await this.hashPass(password);
    return await this.UserModel.create(
      {
        email, name,
        password: hashedPassword

      })

  }

  refreshToken = async (refreshToken: string, id: any) => {
    return await this.UserModel.updateOne(
      { _id: id },
      { refreshToken }

    )
  }
  findRefreshToken = async (refresh_token: string) => {
    return await this.UserModel.findOne({ refreshToken: refresh_token })
      .populate({ path: "role", select: { name: 1 } })
  }



logOutUser = async (user: IUser, response: Response) => {
  response.clearCookie("refresh_token")
  return await this.UserModel.updateOne({ _id: user.id }, { refreshToken: null })
}
}
