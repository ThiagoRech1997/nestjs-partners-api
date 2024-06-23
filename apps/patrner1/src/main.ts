import { NestFactory } from '@nestjs/core';
import { Patrner1Module } from './patrner1.module';

async function bootstrap() {
  const app = await NestFactory.create(Patrner1Module);
  await app.listen(3001);
}
bootstrap();
