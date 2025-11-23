import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,  // 추가
      transform: false,              // 추가
    })
  );

  // Swagger ����
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS + PostgreSQL + TypeORM + Swagger API ����')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`? Server running on http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`? Swagger docs: http://localhost:${process.env.PORT ?? 3000}/api`);
}

bootstrap();
