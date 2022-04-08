import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { TrackCommentService } from 'src/track/track-comment/track-comment.service';
import { GetJWTPayload } from 'src/auth/decorators/get-jwt-payload.decorator';

import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';

import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comment/dto/update-comment.dto';
import { CommentDto } from 'src/comment/dto/comment.dto';

@Controller('track/:trackId/comment')
export class TrackCommentController {
  constructor(private trackCommentService: TrackCommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addComment(
    @GetJWTPayload() jwtPayload: JwtPayload,
    @Param('trackId') trackId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentDto> {
    return this.trackCommentService.addCommentToTrack(
      jwtPayload.email,
      trackId,
      createCommentDto,
    );
  }

  @Put('/:commentId')
  @HttpCode(HttpStatus.OK)
  async updateComment(
    @Param('trackId') trackId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentDto> {
    return this.trackCommentService.updateComment(
      trackId,
      commentId,
      updateCommentDto,
    );
  }

  @Delete('/:commentId')
  @HttpCode(HttpStatus.OK)
  async removeComment(
    @Param('trackId') trackId: string,
    @Param('commentId') commentId: string,
  ): Promise<CommentDto> {
    return this.trackCommentService.removeComment(trackId, commentId);
  }
}
