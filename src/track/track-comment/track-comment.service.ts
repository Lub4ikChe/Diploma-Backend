import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentService } from 'src/comment/comment.service';
import { UserService } from 'src/user/services/user.service';

import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comment/dto/update-comment.dto';
import { CommentDto } from 'src/comment/dto/comment.dto';

import { Track } from 'src/entities/track/track.entity';

@Injectable()
export class TrackCommentService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    private commentService: CommentService,
    private userService: UserService,
  ) {}

  async addCommentToTrack(
    userEmail: string,
    trackId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentDto> {
    const user = await this.userService.getUserByEmail(userEmail);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const track = await this.trackRepository.findOne({ id: trackId });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    const comment = await this.commentService.addCommentToTrack(
      createCommentDto,
      user,
      track,
    );

    return new CommentDto(comment);
  }

  async updateComment(
    trackId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentDto> {
    const track = await this.trackRepository.findOneOrFail({ id: trackId });
    const candidate = track.comments.find(c => c.id === commentId);
    if (!candidate) {
      throw new ConflictException('Comment do not belong to this track');
    }

    const comment = await this.commentService.updateComment(
      commentId,
      updateCommentDto,
    );
    return new CommentDto(comment);
  }

  async removeComment(trackId: string, commentId: string): Promise<CommentDto> {
    const track = await this.trackRepository.findOneOrFail({ id: trackId });
    const candidate = track.comments.find(c => c.id === commentId);
    if (!candidate) {
      throw new ConflictException('Comment do not belong to this track');
    }

    const comment = await this.commentService.removeComment(commentId);
    return new CommentDto(comment);
  }
}
