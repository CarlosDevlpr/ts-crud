import { DataSource } from 'typeorm'
require('dotenv').config()

export const config: any = {
    type: 'postgres',
    host: 'mycrud_db',
    port: 5432,
    migrations: [
        `${__dirname}/migrations/*.ts`
    ],
    entities: [`/usr/app/src/models/*.ts`],
    cli: {
        migrationsDir: `${__dirname}/migrations/`
    },
    database: 'postgres',
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
}

export default new DataSource(config)