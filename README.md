[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Lub4ikChe_Diploma-Backend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Lub4ikChe_Diploma-Backend)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Starting database

- To start the database, simply run

```bash
npm run start:db
or
docker-compose up db
```

- To create the database, run:

```bash
docker exec -ti backend_db_1 sh -c "psql -c 'CREATE DATABASE music_platform;'"
```

## Migrations

- To run migrations you can use:

```bash
npm run migration:apply
```

- To run migrations and seed your local database, run the following:

```bash
env RUN_SEED=true npm run migration:apply
```

> **IMPORTANT**: when setting up the application/database initially you _must_ run with seed enabled. This is
> because some migrations depend on data being present.

Please note that this should _not_ be run in production.

- To show the current available migrations run:

```bash
npm run migration:show
```

- To revert / rollback a migration, run:

```bash
npm run migration:revert
```

> `migration:revert` and `migration:rollback` are aliases

- Updating the timestamp of a migration:

```bash
npm run migration:update-timestamp -- -n=name_of_file
or
npm run migration:update-timestamp -- --name=name_of_file
```

> The .ts extension is optional.

- Dropping the schema / Clean the database

```bash
npm run schema:drop
```

> This will not remove the database users and their priviliges

- See the non-generated sql (diff between entities and database)

```bash
npm run schema:log
```

## Class Validator

In the project I use class validator and it's decorators for property validation on classes.

https://github.com/typestack/class-validator#validation-decorators