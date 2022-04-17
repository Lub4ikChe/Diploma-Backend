import { Controller, HttpStatus, HttpCode, Put, Body } from '@nestjs/common';

import { UserLikedTrackService } from 'src/track/user-liked-track/user-liked-track.service';
import { GetJWTPayload } from 'src/auth/decorators/get-jwt-payload.decorator';

import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';

import { ToggleAddTrackToUserLikedDto } from 'src/track/dto/toggle-add-track-to-user-liked.dto';
import { TrackDto } from 'src/track/dto/track.dto';

@Controller('user/liked-track')
export class UserLikedTrackController {
  constructor(private userLikedTrackService: UserLikedTrackService) {}

  @Put()
  @HttpCode(HttpStatus.OK)
  async toggleAddTrackToUserLiked(
    @GetJWTPayload() jwtPayload: JwtPayload,
    @Body() toggleAddTrackToUserLikedDto: ToggleAddTrackToUserLikedDto,
  ): Promise<TrackDto[]> {
    return this.userLikedTrackService.toggleAddTrackToUserLiked(
      jwtPayload.email,
      toggleAddTrackToUserLikedDto,
    );
  }
}
