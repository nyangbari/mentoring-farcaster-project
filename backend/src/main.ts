import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS + PostgreSQL + TypeORM + Swagger API 문서')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`? Server running on http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`? Swagger docs: http://localhost:${process.env.PORT ?? 3000}/api`);
}

bootstrap();
