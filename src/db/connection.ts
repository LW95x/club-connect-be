import { Pool } from 'pg';
import dotenv from 'dotenv';

const ENV = process.env.NODE_ENV || 'development';

dotenv.config({
    path: `${__dirname}/../../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error('PGDATABASE or DATABASE_URL not set');
}

const config: {[key: string]: any} = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    connectionString: process.env.DATABASE_URL,
    max: 2
};

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2;
}

const pool = new Pool(config);

export default pool;