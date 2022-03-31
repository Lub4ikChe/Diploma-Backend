import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Attachment } from 'src/entities/attachment/attachment.entity';
import { AttachmentService } from 'src/attachment/attachment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment])],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
