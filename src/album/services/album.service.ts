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
import { TrackService } from 'src/track/services/track.service';

import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/album/dto/update-album.dto';
import { DeleteAlbumDto } from 'src/album/dto/delete-album.dto';
import { AlbumDto } from 'src/album/dto/album.dto';
import { AddTracksToAlbumDto } from 'src/album/dto/add-tracks-to-album.dto';
import { GetAlbumDto } from 'src/album/dto/get-album.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    private userService: UserService,
    private attachmentService: AttachmentService,
    private trackService: TrackService,
  ) {}

  async getAlbum(albumId: string): Promise<AlbumDto> {
    const album = await this.albumRepository.findOne(albumId, {
      relations: ['author', 'author.information'],
    });
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return new AlbumDto(album);
  }

  async getAlbums(getAlbumDto: GetAlbumDto): Promise<[AlbumDto[], number]> {
    const { search, page = 0, limit = 10 } = getAlbumDto;

    const query = this.albumRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.author', 'author')
      .leftJoinAndSelect('author.information', 'authorInformation')
      .leftJoinAndSelect('album.tracks', 'tracks')
      .leftJoinAndSelect('tracks.uploadedBy', 'tracksUploadedBy')
      .leftJoinAndSelect('tracksUploadedBy.information', 'tracksUploadedByInfo')
      .leftJoinAndSelect('album.image', 'image');

    if (search) {
      query.andWhere(
        '' +
          ' album.name ILIKE :search OR' +
          ' authorInformation.firstName ILIKE :search OR' +
          ' authorInformation.lastName ILIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    if (page >= 0 && limit) {
      query.skip(page * limit).take(limit);
    }

    const [albums, total] = await query.getManyAndCount();

    return [albums.map(album => new AlbumDto(album)), total];
  }

  async createAlbum(
    createAlbumDto: CreateAlbumDto,
    userEmail: string,
    imageFile: File,
    audios?: File[],
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

    if (audios) {
      const trackIds: string[] = [];
      for (let index = 0; index < audios.length; index++) {
        const trackFile = audios[index];
        const track = await this.trackService.createTrack(
          userEmail,
          {
            name: `${createAlbumDto.name}-#${index + 1}`,
            text: '',
          },
          trackFile,
          imageFile,
        );
        trackIds.push(track.id);
      }
      const tracks = await this.trackRepository.find({
        where: { id: In(trackIds) },
      });
      album.tracks = tracks;
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
      relations: ['author', 'author.information'],
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

    for (const track of album.tracks) {
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
