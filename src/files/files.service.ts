import { Injectable } from '@nestjs/common';
import { UpdateFileDto } from './dto/update-file.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Project, ProjectDocument } from 'src/project/schemas/project.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class FilesService {

  private readonly projectService: ProjectService // Inject ProjectService


  

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
