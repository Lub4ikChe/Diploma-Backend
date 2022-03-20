import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { resolve } from 'path';

const migrations = [];
migrations.push(resolve(__dirname, '../database/migrations/*.{ts,js}'));

if (process.env.NODE_ENV !== 'production' && process.env.RUN_SEED === 'true') {
  migrations.push(resolve(__dirname, `../database/seed/*.{ts,js}`));
}

export const typeOrmCliConfigAsync: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [resolve(__dirname, '../entities/**/*.entity.{ts,js}')],
      migrations,
      synchronize: false,
      cli: {
        migrationsDir: 'src/database/migrations',
      },
      migrationsRun: process.env.TYPEORM_RUN_MIGRATIONS === 'true' || false,
      logging: false,
    };
  },
};
