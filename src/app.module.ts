import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmCliConfigAsync } from './config/typeorm.config';

import { AppService } from './app.service';
import { AppController } from './app.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmCliConfigAsync),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
