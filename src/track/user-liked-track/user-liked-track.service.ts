import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from 'src/user/services/user.service';

import { ToggleAddTrackToUserLikedDto } from 'src/track/dto/toggle-add-track-to-user-liked.dto';
import { TrackDto } from 'src/track/dto/track.dto';

import { Track } from 'src/entities/track/track.entity';
import { UserRepository } from 'src/user/repositories/user.repository';

@Injectable()
export class UserLikedTrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private userService: UserService,
  ) {}

  async toggleAddTrackToUserLiked(
    userEmail: string,
    toggleAddTrackToUserLikedDto: ToggleAddTrackToUserLikedDto,
  ): Promise<TrackDto[]> {
    const { trackId } = toggleAddTrackToUserLikedDto;

    const track = await this.trackRepository.findOne(trackId);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    const user = await this.userRepository.findOne({
      where: { email: userEmail },
      relations: ['likedTracks'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userLikedTracksIds = user.likedTracks.map(lt => lt.id);

    let newUserLikedTracks = user.likedTracks;
    if (userLikedTracksIds.includes(trackId)) {
      newUserLikedTracks = newUserLikedTracks.filter(t => t.id !== trackId);
    } else {
      newUserLikedTracks.push(track);
    }

    user.likedTracks = newUserLikedTracks;
    await this.userRepository.save(user);

    return newUserLikedTracks.map(t => new TrackDto(t));
  }
}
