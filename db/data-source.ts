//sample for generating migrations

import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'arte7',
    entities: ['dist/**/*.entity.js'],
    dropSchema: true,
    synchronize: true,
    migrations: ['dist/shared/migrations/**/*{.ts,.js}'],
    migrationsRun: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

/**
 * Command for generating migrations
 * npm run typeorm -- -d dist/db/data-source.js migration:generate ./src/shared/migrations/newMigration
 * / */
