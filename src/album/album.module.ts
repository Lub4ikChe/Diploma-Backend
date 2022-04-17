import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserModule } from 'src/user/user.module';
import { AttachmentModule } from 'src/attachment/attachment.module';
import { TrackModule } from 'src/track/track.module';

import { AlbumController } from 'src/album/album.controller';

import { AlbumService } from 'src/album/services/album.service';

import { Album } from 'src/entities/album/album.entity';
import { Track } from 'src/entities/track/track.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album, Track]),
    UserModule,
    AttachmentModule,
    TrackModule,
  ],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumModule {}
