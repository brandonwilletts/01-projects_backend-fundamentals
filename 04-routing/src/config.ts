import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenv.config({ path: envFile });

export const config = {
  env: process.env.NODE_ENV,
  server: {
    port: Number(process.env.PORT),
    hostname: String(process.env.HOSTNAME),
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};
