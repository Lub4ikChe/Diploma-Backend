import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserInformation } from 'src/entities/user-information/user-information.entity';
import { Attachment } from 'src/entities/attachment/attachment.entity';

import { AttachmentService } from 'src/attachment/attachment.service';

import { AttachmentTypes } from 'src/attachment/enums/attachment-types.enum';
import { AttachmentFolderTypes } from 'src/attachment/enums/attachment-folder-types.enum';

@Injectable()
export class UserPhotoService {
  constructor(
    private attachmentService: AttachmentService,
    @InjectRepository(UserInformation)
    private userInformationRepository: Repository<UserInformation>,
  ) {}

  async createUserPhoto(
    userId: string,
    file: Express.Multer.File,
  ): Promise<Attachment> {
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
    return attachment;
  }

  async updateUserPhoto(
    userId: string,
    file: Express.Multer.File,
  ): Promise<Attachment> {
    const userInfo = await this.findUserInfo(userId);
    if (!userInfo.photo) {
      return this.createUserPhoto(userId, file);
    }

    return this.attachmentService.updateFile(userInfo.photo.id, file);
  }

  async removeUserPhoto(userId: string): Promise<Attachment> {
    const userInfo = await this.findUserInfo(userId);
    if (!userInfo.photo) {
      return;
    }
    const attachmentId = userInfo.photo.id;
    userInfo.photo = null;
    await this.userInformationRepository.save(userInfo);
    return this.attachmentService.removeFile(attachmentId);
  }

  private async findUserInfo(userId: string): Promise<UserInformation> {
    return this.userInformationRepository.findOneOrFail({
      userId,
    });
  }
}
