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
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import { Attachment } from 'src/entities/attachment/attachment.entity';

@Controller('user/photo')
export class UserPhotoController {
  constructor(private userPhotoService: UserPhotoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: 800000 } }))
  async createUserPhoto(
    @GetJWTPayload() jwtPayload: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Attachment> {
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
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Attachment> {
    if (!file) {
      throw new BadRequestException('Photo not uploaded');
    }

    return this.userPhotoService.updateUserPhoto(jwtPayload.userId, file);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async removeUserPhoto(
    @GetJWTPayload() jwtPayload: JwtPayload,
  ): Promise<Attachment> {
    return this.userPhotoService.removeUserPhoto(jwtPayload.userId);
  }
}
