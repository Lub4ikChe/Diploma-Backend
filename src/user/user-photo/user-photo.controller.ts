import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Put,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserPhotoService } from 'src/user/user-photo/user-photo.service';
import { GetJWTPayload } from 'src/auth/decorators/get-jwt-payload.decorator';
import { File } from 'src/attachment/file/file.type';

import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import { AttachmentDto } from 'src/attachment/dto/attachment.dto';

@Controller('user/photo')
export class UserPhotoController {
  constructor(private userPhotoService: UserPhotoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: 800000 } }))
  async createUserPhoto(
    @GetJWTPayload() jwtPayload: JwtPayload,
    @UploadedFile() file: File,
  ): Promise<AttachmentDto> {
    if (!file) {
      throw new BadRequestException('Photo not uploaded');
    }

    return this.userPhotoService.createUserPhoto(jwtPayload.userId, file);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: 800000 } }))
  async updateUserPhoto(
    @GetJWTPayload() jwtPayload: JwtPayload,
    @UploadedFile() file: File,
  ): Promise<AttachmentDto> {
    if (!file) {
      throw new BadRequestException('Photo not uploaded');
    }

    return this.userPhotoService.updateUserPhoto(jwtPayload.userId, file);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async removeUserPhoto(
    @GetJWTPayload() jwtPayload: JwtPayload,
  ): Promise<AttachmentDto> {
    return this.userPhotoService.removeUserPhoto(jwtPayload.userId);
  }
}
