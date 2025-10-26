import 'dotenv/config';
import { DataSource } from 'typeorm';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL not found');

export default new DataSource({
  type: 'postgres',
  url,
  ssl: { rejectUnauthorized: false },
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
