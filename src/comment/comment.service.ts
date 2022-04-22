import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from 'src/entities/comment/comment.entity';
import { User } from 'src/entities/user/user.entity';
import { Track } from 'src/entities/track/track.entity';

import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comment/dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async addCommentToTrack(
    createCommentDto: CreateCommentDto,
    author: User,
    track: Track,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({ ...createCommentDto });
    comment.author = author;
    comment.track = track;
    comment.commentedAt = new Date();

    return this.commentRepository.save(comment);
  }

  async updateComment(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne(
      { id: commentId },
      { relations: ['author', 'author.information'] },
    );
    if (!comment) {
      throw new NotFoundException();
    }

    const { text } = updateCommentDto;
    comment.text = text;
    comment.commentedAt = new Date();
    return this.commentRepository.save(comment);
  }

  async removeComment(commentId: string): Promise<Comment> {
    const comment = await this.commentRepository.findOneOrFail(commentId);
    await this.commentRepository.remove(comment);
    return comment;
  }
}
