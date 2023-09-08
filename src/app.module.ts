import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigService
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { AuthModule } from './auth/auth.module';
import { TransformInterceptor } from './interceptor/interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TasksModule } from './tasks/tasks.module';
import { ProjectModule } from './project/project.module';
import { FilesModule } from './files/files.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule here
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('URL_DATABASE_USER'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
          }
      }),
      inject: [ConfigService], // Inject ConfigService into the factory
    }),
    UsersModule,
    AuthModule,
    TasksModule,
    ProjectModule,
    FilesModule,
    RolesModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
