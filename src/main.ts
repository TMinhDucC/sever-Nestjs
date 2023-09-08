import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './interceptor/interceptor';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService)
  
  app.use(cookieParser());
  //config versioning 
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
    // prefix: 'api/v'
  });

  //pipe validate
  app.useGlobalPipes(
    new ValidationPipe({ }),
  );

  await app.listen(configService.get<string>('PORT'));
}

bootstrap();
