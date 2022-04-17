import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserInformation } from 'src/entities/user-information/user-information.entity';

import { AttachmentService } from 'src/attachment/attachment.service';

import { AttachmentTypes } from 'src/attachment/enums/attachment-types.enum';
import { AttachmentFolderTypes } from 'src/attachment/enums/attachment-folder-types.enum';

import { File } from 'src/attachment/file/file.type';

import { AttachmentDto } from 'src/attachment/dto/attachment.dto';

@Injectable()
export class UserPhotoService {
  constructor(
    private attachmentService: AttachmentService,
    @InjectRepository(UserInformation)
    private userInformationRepository: Repository<UserInformation>,
  ) {}

  async createUserPhoto(userId: string, file: File): Promise<AttachmentDto> {
    const userInfo = await this.findUserInfo(userId);
    if (userInfo.photo) {
      throw new ConflictException('Photo already exists');
    }
    const attachment = await this.attachmentService.createFile(
      file,
      AttachmentFolderTypes.USER,
      AttachmentTypes.PHOTO,
    );
    userInfo.photo = attachment;
    await this.userInformationRepository.save(userInfo);
    return new AttachmentDto(attachment);
  }

  async updateUserPhoto(userId: string, file: File): Promise<AttachmentDto> {
    const userInfo = await this.findUserInfo(userId);
    if (!userInfo.photo) {
      return this.createUserPhoto(userId, file);
    }

    const attachment = await this.attachmentService.updateFile(
      userInfo.photo.id,
      file,
    );
    return new AttachmentDto(attachment);
  }

  async removeUserPhoto(userId: string): Promise<AttachmentDto> {
    const userInfo = await this.findUserInfo(userId);
    if (!userInfo.photo) {
      return;
    }
    const attachmentId = userInfo.photo.id;
    userInfo.photo = null;
    await this.userInformationRepository.save(userInfo);

    const attachment = await this.attachmentService.removeFile(attachmentId);
    return new AttachmentDto(attachment);
  }

  private async findUserInfo(userId: string): Promise<UserInformation> {
    return this.userInformationRepository.findOneOrFail({
      userId,
    });
  }
}
