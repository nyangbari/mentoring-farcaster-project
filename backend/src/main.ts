import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Nest 애플리케이션 생성 + CORS 허용
  const app = await NestFactory.create(AppModule, { cors: true });

  // DTO 유효성 검사 활성화 (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,   // DTO에 없는 값 자동 제거
      transform: true,   // payload를 DTO 타입으로 자동 변환
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Mentoring Farcaster Project - API')
    .setDescription('Backend API documentation for the social community project')
    .setVersion('0.1.0')
    .addTag('backend')
    .build();

  // Swagger 문서 생성
  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI 경로: http://localhost:3000/api
  SwaggerModule.setup('api', app, document);

  // 서버 실행
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📘 Swagger docs available at http://localhost:${process.env.PORT ?? 3000}/api`);
}

bootstrap();
