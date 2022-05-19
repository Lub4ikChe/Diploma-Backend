import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  UseInterceptors,
  Put,
  Delete,
  Body,
  Get,
  Param,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { AlbumService } from 'src/album/services/album.service';

import { GetJWTPayload } from 'src/auth/decorators/get-jwt-payload.decorator';
import { SkipAuth } from 'src/auth/decorators/skip-auth.decorator';

import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import { File } from 'src/attachment/file/file.type';

import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/album/dto/update-album.dto';
import { DeleteAlbumDto } from 'src/album/dto/delete-album.dto';
import { AlbumDto } from 'src/album/dto/album.dto';
import { AddTracksToAlbumDto } from 'src/album/dto/add-tracks-to-album.dto';
import { GetAlbumDto } from 'src/album/dto/get-album.dto';

interface CreateAlbumFiles {
  image: File[];
  audio: File[];
}

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get('/:albumId')
  @HttpCode(HttpStatus.OK)
  async getAlbum(@Param('albumId') albumId: string): Promise<AlbumDto> {
    return this.albumService.getAlbum(albumId);
  }

  @SkipAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAlbums(
    @Query() getAlbumDto: GetAlbumDto,
  ): Promise<[AlbumDto[], number]> {
    return this.albumService.getAlbums(getAlbumDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'audio', maxCount: 15 },
    ]),
  )
  async createAlbum(
    @Body() createAlbumDto: CreateAlbumDto,
    @GetJWTPayload() jwtPayload: JwtPayload,
    @UploadedFiles() files: CreateAlbumFiles,
  ): Promise<AlbumDto> {
    const { image, audio } = files;
    return this.albumService.createAlbum(
      createAlbumDto,
      jwtPayload.email,
      image[0],
      audio,
    );
  }

  @Put('/:albumId')
  @HttpCode(HttpStatus.OK)
  async updateAlbum(
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Param('albumId') albumId: string,
    @GetJWTPayload() jwtPayload: JwtPayload,
  ): Promise<AlbumDto> {
    return this.albumService.updateAlbum(
      updateAlbumDto,
      albumId,
      jwtPayload.userId,
    );
  }

  @Put('/:albumId/add-tracks')
  @HttpCode(HttpStatus.OK)
  async addTracksToAlbum(
    @Body() addTracksToAlbumDto: AddTracksToAlbumDto,
    @Param('albumId') albumId: string,
    @GetJWTPayload() jwtPayload: JwtPayload,
  ): Promise<AlbumDto> {
    return this.albumService.addTracksToAlbum(
      addTracksToAlbumDto,
      albumId,
      jwtPayload.userId,
    );
  }

  @Delete('/:albumId')
  @HttpCode(HttpStatus.OK)
  async removeAlbum(
    @Body() deleteAlbumDto: DeleteAlbumDto,
    @Param('albumId') albumId: string,
  ): Promise<AlbumDto> {
    return this.albumService.removeAlbum(deleteAlbumDto, albumId);
  }
}
