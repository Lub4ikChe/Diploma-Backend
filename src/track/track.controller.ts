import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  UseInterceptors,
  Put,
  Delete,
  UploadedFiles,
  Body,
  Get,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { TrackService } from 'src/track/services/track.service';

import { GetJWTPayload } from 'src/auth/decorators/get-jwt-payload.decorator';
import { SkipAuth } from 'src/auth/decorators/skip-auth.decorator';

import { File } from 'src/attachment/file/file.type';

import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';

import { CreateTrackDto } from 'src/track/dto/create-track.dto';
import { UpdateTrackDto } from 'src/track/dto/update-track.dto';
import { TrackDto } from 'src/track/dto/track.dto';
import { GetTrackDto } from 'src/track/dto/get-track.dto';

interface CreateTrackFiles {
  audio: File[];
  image: File[];
}

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get('/:trackId')
  @HttpCode(HttpStatus.OK)
  async getTrack(@Param('trackId') trackId: string): Promise<TrackDto> {
    return this.trackService.getTrack(trackId);
  }

  @SkipAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getTracks(
    @Query() getTrackDto: GetTrackDto,
  ): Promise<[TrackDto[], number]> {
    return this.trackService.getTracks(getTrackDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  async createTrack(
    @GetJWTPayload() jwtPayload: JwtPayload,
    @Body() createTrackDto: CreateTrackDto,
    @UploadedFiles() files: CreateTrackFiles,
  ): Promise<TrackDto> {
    const { audio, image } = files;
    return this.trackService.createTrack(
      jwtPayload.email,
      createTrackDto,
      audio[0],
      image[0],
    );
  }

  @Put('/:trackId')
  @HttpCode(HttpStatus.OK)
  async updateTrack(
    @Param('trackId') trackId: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<TrackDto> {
    return this.trackService.updateTrack(trackId, updateTrackDto);
  }

  @Delete('/:trackId')
  @HttpCode(HttpStatus.OK)
  async removeTrack(@Param('trackId') trackId: string): Promise<TrackDto> {
    return this.trackService.removeTrack(trackId);
  }

  @Post('/:trackId/listen')
  @HttpCode(HttpStatus.OK)
  async listenTrack(@Param('trackId') trackId: string): Promise<TrackDto> {
    return this.trackService.listenTrack(trackId);
  }

  @Get('/:trackId/download')
  @HttpCode(HttpStatus.OK)
  async downloadTrack(
    @Param('trackId') trackId: string,
    @Res() response: Response,
  ): Promise<void> {
    return this.trackService.downloadTrack(trackId, response);
  }
}
