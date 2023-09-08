import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseInterceptors, UploadedFile, ParseFilePipeBuilder } from '@nestjs/common';
import { FilesService } from './files.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { ResponseMessage } from 'src/decorator/responMessage';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/decorator/user.decorator';
import { IUser } from 'src/users/user.interface';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }


  @ResponseMessage('ok upload')
  @Post('upload')
  @UseInterceptors(FileInterceptor('fileUpLoad')) //tên field sử dụng trong form-data
  async uploadFile(@User() user: IUser, @UploadedFile(

    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /^(jpg|jpeg|png|image\/jpeg|image\/png|gif|txt|pdf|doc|docx|text\/plain)$/i,

      })
      .addMaxSizeValidator({
        maxSize: 1024 * 1024
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),

  ) file: Express.Multer.File) {
    
    return { fileName: file.filename }
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
