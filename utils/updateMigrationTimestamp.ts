import { readFileSync, existsSync, renameSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const args = yargs(hideBin(process.argv)).option('name', {
  alias: 'n',
  describe: 'name of the migration to update timestamp',
  demandOption: true,
  coerce: (fileName: string) => {
    let tsEndingPath = fileName;
    if (!tsEndingPath.endsWith('.ts')) {
      tsEndingPath += '.ts';
    }
    return tsEndingPath;
  },
}).argv;

const fileName = args.name;

const renameFile = basePath => {
  const [oldTimestamp, migrationName] = fileName.split('-');
  const newTimestamp = new Date().getTime().toString();
  const newFileName = `${newTimestamp}-${migrationName}`;

  writeFileSync(
    resolve(basePath, fileName),
    readFileSync(resolve(basePath, fileName), 'utf8').replace(
      RegExp(oldTimestamp, 'g'),
      newTimestamp,
    ),
  );
  renameSync(resolve(basePath, fileName), resolve(basePath, newFileName));
  console.log(`File migrated to: ${basePath}/${newFileName}`);
};

const execute = () => {
  const migrationsBaseBath = './src/database/migrations';
  const seedBasePath = './src/database/seed';

  const migrationsFilePath = resolve(migrationsBaseBath, fileName);
  const seedFilePath = resolve(seedBasePath, fileName);

  if (existsSync(migrationsFilePath)) {
    renameFile(migrationsBaseBath);
  } else if (existsSync(seedFilePath)) {
    renameFile(seedBasePath);
  } else {
    throw new Error(`No such file: ${fileName}`);
  }
};

module.exports = execute();
