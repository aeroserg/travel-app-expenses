import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:4000',
      'http://0.0.0.0:3000',
      'http://0.0.0.0:4000',
      'http://84.201.130.195:32000',
      'http://84.201.130.195.nip.io:30701',
      'http://84.201.130.195:30701',
      'http://84.201.130.195',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.setGlobalPrefix('api');

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
