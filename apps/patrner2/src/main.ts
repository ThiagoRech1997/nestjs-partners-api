import { NestFactory } from '@nestjs/core';
import { Patrner2Module } from './patrner2.module';

async function bootstrap() {
  const app = await NestFactory.create(Patrner2Module);
  await app.listen(3002);
}
bootstrap();
