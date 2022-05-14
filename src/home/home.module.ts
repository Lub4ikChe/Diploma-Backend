import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { HomeService } from 'src/home/home.service';

import { HomeController } from 'src/home/home.controller';

import { Album } from 'src/entities/album/album.entity';
import { Track } from 'src/entities/track/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Track])],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
