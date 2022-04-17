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
  UploadedFile,
  NotImplementedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AlbumService } from 'src/album/services/album.service';
import { GetJWTPayload } from 'src/auth/decorators/get-jwt-payload.decorator';

import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import { File } from 'src/attachment/file/file.type';

import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/album/dto/update-album.dto';
import { AlbumDto } from 'src/album/dto/album.dto';
import { AddTracksToAlbumDto } from 'src/album/dto/add-tracks-to-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get('/:albumId')
  @HttpCode(HttpStatus.OK)
  async getAlbums(@Param('albumId') albumId: string): Promise<AlbumDto> {
    return this.albumService.getAlbum(albumId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', { limits: { fileSize: 800000 } }))
  async createAlbum(
    @Body() createAlbumDto: CreateAlbumDto,
    @GetJWTPayload() jwtPayload: JwtPayload,
    @UploadedFile() file: File,
  ): Promise<AlbumDto> {
    return this.albumService.createAlbum(
      createAlbumDto,
      jwtPayload.email,
      file,
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
  async removeAlbum() {
    // TODO: implement remove logic
    return new NotImplementedException();
  }
}
