import { Logger, Module } from '@nestjs/common';
import * as path from 'path';

import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmCliConfigAsync } from 'src/config/typeorm.config';
import { Connection } from 'typeorm';

import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';

import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AttachmentModule } from 'src/attachment/attachment.module';
import { TrackModule } from 'src/track/track.module';
import { CommentModule } from 'src/comment/comment.module';

import { AppService } from 'src/app.service';
import { AppController } from 'src/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ServeStaticModule.forRootAsync({
      useFactory: () => [
        {
          rootPath: path.resolve(__dirname, process.env.STATIC_FOLDER_NAME),
          exclude: ['*'],
        },
      ],
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          ignoreTLS: false,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
          },
        },
        defaults: {
          from: process.env.DEFAULT_SENDER,
        },
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmCliConfigAsync),
    AuthModule,
    UserModule,
    AttachmentModule,
    TrackModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}

  private migrationLogger = new Logger('Migration');

  async onApplicationBootstrap() {
    const migrations = await this.connection.showMigrations();

    if (process.env.NODE_ENV !== 'production' && migrations) {
      this.migrationLogger.error(`----------------------------------------`);
      this.migrationLogger.error(`There are migrations that need to run  !`);
      this.migrationLogger.error(`----------------------------------------`);
    }
  }
}
