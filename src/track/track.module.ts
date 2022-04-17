import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/user/user.module';
import { AttachmentModule } from 'src/attachment/attachment.module';
import { CommentModule } from 'src/comment/comment.module';

import { TrackController } from 'src/track/track.controller';
import { TrackCommentController } from 'src/track/track-comment/track-comment.controller';
import { UserLikedTrackController } from 'src/track/user-liked-track/user-liked-track.controller';

import { TrackService } from 'src/track/services/track.service';
import { TrackCommentService } from 'src/track/track-comment/track-comment.service';
import { UserLikedTrackService } from 'src/track/user-liked-track/user-liked-track.service';

import { Track } from 'src/entities/track/track.entity';
import { UserRepository } from 'src/user/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track, UserRepository]),
    UserModule,
    AttachmentModule,
    CommentModule,
  ],
  providers: [TrackService, TrackCommentService, UserLikedTrackService],
  controllers: [
    TrackController,
    TrackCommentController,
    UserLikedTrackController,
  ],
})
export class TrackModule {}
