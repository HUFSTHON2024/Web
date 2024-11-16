import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // React 앱의 주소
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
  });
  console.log('BE 서버 구동 시작');
  await app.listen(4000); // BE는 4000 포트 사용
}

bootstrap();
