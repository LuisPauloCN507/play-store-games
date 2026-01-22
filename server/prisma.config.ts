import { defineConfig } from '@prisma/config';
import 'dotenv/config'; // IMPORTANTE: Isso carrega as variáveis do seu arquivo .env

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});