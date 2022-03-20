import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmCliConfigAsync } from './config/typeorm.config';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Connection } from 'typeorm';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmCliConfigAsync),
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
