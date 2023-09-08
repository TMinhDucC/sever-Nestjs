import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';
import { ProjectModule } from 'src/project/project.module'; // Import ProjectModule
import { ProjectService } from 'src/project/project.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService], // Add ProjectService as a provider
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    
  ],
})
export class FilesModule {}
