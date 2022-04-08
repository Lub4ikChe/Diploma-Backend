import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/user/user.module';
import { AttachmentModule } from 'src/attachment/attachment.module';
import { CommentModule } from 'src/comment/comment.module';

import { TrackController } from 'src/track/track.controller';
import { TrackCommentController } from 'src/track/track-comment/track-comment.controller';

import { TrackService } from 'src/track/services/track.service';
import { TrackCommentService } from 'src/track/track-comment/track-comment.service';

import { Track } from 'src/entities/track/track.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),
    UserModule,
    AttachmentModule,
    CommentModule,
  ],
  providers: [TrackService, TrackCommentService],
  controllers: [TrackController, TrackCommentController],
})
export class TrackModule {}
