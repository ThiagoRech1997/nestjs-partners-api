import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SpotsModule } from './spots/spots.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env.partner2' }), EventsModule, SpotsModule],
})
export class Patrner2Module { }
