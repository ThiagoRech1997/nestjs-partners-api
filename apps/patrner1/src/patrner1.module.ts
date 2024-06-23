import { Module } from '@nestjs/common';
import { SpotsModule } from './spots/spots.module';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.partner1', isGlobal: true }), 
    AuthModule,
    EventsModule, 
    SpotsModule, 
    AuthModule
  ],
})
export class Patrner1Module { }
