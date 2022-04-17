import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { AttachmentTypes } from 'src/attachment/enums/attachment-types.enum';
import { AttachmentFolderTypes } from 'src/attachment/enums/attachment-folder-types.enum';

import { Album } from 'src/entities/album/album.entity';
import { Track } from 'src/entities/track/track.entity';

import { File } from 'src/attachment/file/file.type';

import { AttachmentService } from 'src/attachment/attachment.service';
import { UserService } from 'src/user/services/user.service';

import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/album/dto/update-album.dto';
import { DeleteAlbumDto } from 'src/album/dto/delete-album.dto';
import { AlbumDto } from 'src/album/dto/album.dto';
import { AddTracksToAlbumDto } from 'src/album/dto/add-tracks-to-album.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    private userService: UserService,
    private attachmentService: AttachmentService,
  ) {}

  async getAlbum(albumId: string) {
    const album = await this.albumRepository.findOne(albumId);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return new AlbumDto(album);
  }

  async createAlbum(
    createAlbumDto: CreateAlbumDto,
    userEmail: string,
    imageFile: File,
  ): Promise<AlbumDto> {
    const user = await this.userService.getUserByEmail(userEmail);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const album = this.albumRepository.create({ ...createAlbumDto });
    album.author = user;

    if (imageFile) {
      const image = await this.attachmentService.createFile(
        imageFile,
        AttachmentFolderTypes.ALBUM,
        AttachmentTypes.PHOTO,
      );
      album.image = image;
    }

    await this.albumRepository.save(album);
    return new AlbumDto(album);
  }

  async updateAlbum(
    updateAlbumDto: UpdateAlbumDto,
    albumId: string,
    userId: string,
  ) {
    const album = await this.albumRepository.findOne({
      where: {
        id: albumId,
        author: userId,
      },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    const { name } = updateAlbumDto;
    album.name = name;

    await this.albumRepository.save(album);
    return new AlbumDto(album);
  }

  async addTracksToAlbum(
    addTracksToAlbumDto: AddTracksToAlbumDto,
    albumId: string,
    userId: string,
  ): Promise<AlbumDto> {
    const { trackIds } = addTracksToAlbumDto;

    const album = await this.albumRepository.findOne(albumId);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    const uniqueTrackIds = Array.from(
      new Set([...album.tracks.map(t => t.id), ...trackIds]),
    );
    const tracks = await this.trackRepository.find({
      where: { id: In(uniqueTrackIds) },
    });

    if (tracks.some(track => track.uploadedBy.id !== userId)) {
      throw new ConflictException('You can add only your tracks');
    }

    album.tracks = tracks;
    await this.albumRepository.save(album);
    return new AlbumDto(album);
  }

  async removeAlbum(deleteAlbumDto: DeleteAlbumDto, albumId: string) {
    const album = await this.albumRepository.findOneOrFail(albumId);
    const { deleteWithTrack } = deleteAlbumDto;

    for (let i = 0; i < album.tracks.length; i++) {
      const track = album.tracks[i];
      if (deleteWithTrack) {
        await this.trackRepository.remove(track);
        await this.attachmentService.removeFile(track.audio.id);
        await this.attachmentService.removeFile(track.image.id);
      } else {
        track.album = null;
        await this.trackRepository.save(track);
      }
    }

    await this.albumRepository.remove(album);
    await this.attachmentService.removeFile(album.image.id);
    return new AlbumDto(album);
  }
}
