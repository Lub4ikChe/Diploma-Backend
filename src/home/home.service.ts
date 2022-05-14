import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Album } from 'src/entities/album/album.entity';
import { Track } from 'src/entities/track/track.entity';

import { HomeDto } from 'src/home/dto/home.dto';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  async getHomeItems(): Promise<HomeDto> {
    const tracks = await this.trackRepository.find({
      relations: ['uploadedBy', 'uploadedBy.information'],
      take: 10,
      order: {
        uploadedAt: -1,
      },
    });

    const albums = await this.albumRepository.find({
      relations: ['author', 'author.information'],
      take: 10,
      order: {
        id: 1,
      },
    });

    return new HomeDto({ tracks, albums });
  }
}
