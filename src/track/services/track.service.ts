import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from 'src/user/services/user.service';
import { AttachmentService } from 'src/attachment/attachment.service';

import { AttachmentTypes } from 'src/attachment/enums/attachment-types.enum';
import { AttachmentFolderTypes } from 'src/attachment/enums/attachment-folder-types.enum';

import { File } from 'src/attachment/file/file.type';

import { CreateTrackDto } from 'src/track/dto/create-track.dto';
import { UpdateTrackDto } from 'src/track/dto/update-track.dto';
import { TrackDto } from 'src/track/dto/track.dto';
import { GetTrackDto } from 'src/track/dto/get-track.dto';

import { Track } from 'src/entities/track/track.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    private userService: UserService,
    private attachmentService: AttachmentService,
  ) {}

  async getTrack(trackId: string): Promise<TrackDto> {
    const track = await this.trackRepository.findOne(
      { id: trackId },
      {
        relations: [
          'uploadedBy',
          'uploadedBy.information',
          'comments',
          'comments.author',
          'comments.author.information',
        ],
      },
    );
    if (!track) {
      throw new NotFoundException();
    }

    return new TrackDto(track);
  }

  async getTracks(getTrackDto: GetTrackDto): Promise<[TrackDto[], number]> {
    const { search, page = 0, limit = 10 } = getTrackDto;

    const query = this.trackRepository
      .createQueryBuilder('track')
      .leftJoinAndSelect('track.uploadedBy', 'uploadedBy')
      .leftJoinAndSelect('uploadedBy.information', 'uploadedByInformation')
      .leftJoinAndSelect('track.audio', 'audio')
      .leftJoinAndSelect('track.image', 'image')
      .leftJoinAndSelect('track.album', 'album')
      .leftJoinAndSelect('track.comments', 'comments')
      .leftJoinAndSelect('comments.author', 'commentsAuthor');

    if (search) {
      query.andWhere(
        '' +
          ' track.name ILIKE :search OR' +
          ' uploadedByInformation.firstName ILIKE :search OR' +
          ' uploadedByInformation.lastName ILIKE :search OR' +
          ' album.name ILIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    if (page >= 0 && limit) {
      query.skip(page * limit).take(limit);
    }

    const [tracks, total] = await query.getManyAndCount();

    return [tracks.map(track => new TrackDto(track)), total];
  }

  async createTrack(
    userEmail: string,
    createTrackDto: CreateTrackDto,
    audioFile: File,
    imageFile: File,
  ): Promise<TrackDto> {
    const user = await this.userService.getUserByEmail(userEmail);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const track = this.trackRepository.create({ ...createTrackDto });
    track.uploadedAt = new Date();
    track.uploadedBy = user;

    const audio = await this.attachmentService.createFile(
      audioFile,
      AttachmentFolderTypes.TRACK,
      AttachmentTypes.AUDIO,
    );
    const image = await this.attachmentService.createFile(
      imageFile,
      AttachmentFolderTypes.TRACK,
      AttachmentTypes.PHOTO,
    );

    track.audio = audio;
    track.image = image;
    await this.trackRepository.save(track);

    return new TrackDto(track);
  }

  async updateTrack(
    trackId: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<TrackDto> {
    const track = await this.trackRepository.findOne({ id: trackId });

    if (!track) {
      throw new NotFoundException();
    }

    const { text, name } = updateTrackDto;
    track.name = name;
    track.text = text;
    await this.trackRepository.save(track);

    return new TrackDto(track);
  }

  async removeTrack(trackId: string): Promise<TrackDto> {
    const track = await this.trackRepository.findOneOrFail(trackId);
    await this.trackRepository.remove(track);
    await this.attachmentService.removeFile(track.audio.id);
    await this.attachmentService.removeFile(track.image.id);
    return new TrackDto(track);
  }

  async listenTrack(trackId: string): Promise<TrackDto> {
    const track = await this.trackRepository.findOneOrFail(trackId);
    track.listensCount += 1;
    await this.trackRepository.save(track);
    return new TrackDto(track);
  }
}
