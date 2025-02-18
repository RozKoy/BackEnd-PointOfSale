import { 
  HttpStatus,
  HttpException,
  ValidationPipe
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set 'api' prefix
  app.setGlobalPrefix('api');

  // Use global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result: {property: string, message: string}[] = errors.map((error, index) => {
          const length: number = Object.keys(error.constraints).length;
          return {
            property: error.property,
            message: error.constraints[Object.keys(error.constraints)[length - 1]],
          }
        });
        return new HttpException(result, HttpStatus.BAD_REQUEST);
      },
      stopAtFirstError: false,
    }),
  );

  // Use global exception filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Use swagger module
  const config = new DocumentBuilder()
    .setDescription('Point of Sale API Documentation')
    .setTitle('Point of Sale')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-documentation', app, swaggerDoc);

  await app.listen(3000);
}
bootstrap();
