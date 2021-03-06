import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

import { File } from 'src/attachment/file/file.type';
import { PrepareDownloadFile } from 'src/attachment/file/prepare-download.interface';

import { AttachmentTypes } from 'src/attachment/enums/attachment-types.enum';
import { AttachmentFolderTypes } from 'src/attachment/enums/attachment-folder-types.enum';

import { Attachment } from 'src/entities/attachment/attachment.entity';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
  ) {}

  async createFile(
    file: File,
    folderType: AttachmentFolderTypes,
    type: AttachmentTypes,
  ) {
    let attachment: Attachment;
    try {
      const fileName = this.createFileName(file.originalname);
      const filePath = this.createFilePath(folderType, type);
      this.createFileOnServer(file, filePath, fileName);

      attachment = this.attachmentRepository.create();
      attachment.originalName = file.originalname;
      attachment.folderType = folderType;
      attachment.type = type;
      attachment.name = fileName;
      return this.attachmentRepository.save(attachment);
    } catch (error) {
      await this.attachmentRepository.remove(attachment);
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeFile(attachmentId: string) {
    try {
      const attachment = await this.getAttachmentById(attachmentId);
      const { name, folderType, type } = attachment;

      const filePath = this.createFilePath(folderType, type);
      this.removeFileFromServer(filePath, name);
      return this.attachmentRepository.remove(attachment);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateFile(attachmentId: string, file: File) {
    try {
      const attachment = await this.getAttachmentById(attachmentId);
      const { name, folderType, type } = attachment;

      const filePath = this.createFilePath(folderType, type);
      this.removeFileFromServer(filePath, name);

      const fileName = this.createFileName(file.originalname);
      this.createFileOnServer(file, filePath, fileName);

      attachment.name = fileName;
      attachment.originalName = file.originalname;
      return this.attachmentRepository.save(attachment);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async prepareDownloadFile(
    attachmentId: string,
    folderType: AttachmentFolderTypes,
    type: AttachmentTypes,
  ): Promise<PrepareDownloadFile> {
    const attachment = await this.getAttachmentById(attachmentId);
    const filePath = path.resolve(
      this.createFilePath(folderType, type),
      attachment.name,
    );

    return {
      path: filePath,
      name: attachment.name,
    };
  }

  private removeFileFromServer(filePath: string, fileName: string): void {
    fs.rmSync(path.resolve(filePath, fileName));
  }

  private createFileOnServer(
    file: File,
    filePath: string,
    fileName: string,
  ): void {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
  }

  private createFilePath(
    folderType: AttachmentFolderTypes,
    type: AttachmentTypes,
  ): string {
    return path.resolve(__dirname, '..', 'static', folderType, type);
  }

  private async getAttachmentById(id: string): Promise<Attachment> {
    return this.attachmentRepository.findOneOrFail({
      id,
    });
  }

  private createFileName(originalName: string) {
    const fileExtension = originalName.split('.').pop();
    return `${uuid.v4()}.${fileExtension}`;
  }
}
