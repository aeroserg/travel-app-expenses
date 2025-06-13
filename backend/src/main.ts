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
      'http://158.160.44.174.nip.io:32000',
      'http://158.160.44.174:30701',
      'http://158.160.44.174.nip.io:30701',
      'http://158.160.44.174.nip.io',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.setGlobalPrefix('api');

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
