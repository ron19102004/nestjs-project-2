/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
dotenv.config();
export default () => ({
  PORT: parseInt(process.env.PORT_SERVER, 10) || 3000,
  DATABASE: {
    HOST: process.env.DATABASE_HOST,
    PORT: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    USERNAME: process.env.DATABASE_USER,
    PASSWORD: process.env.DATABASE_PASS,
    DATABASE: process.env.DATABASE,
  },
  JWT: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  },
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_FROM: process.env.MAIL_FROM,
  MAIL_TRANSPORT: process.env.MAIL_TRANSPORT,
  MAIL_PORT: parseInt(process.env.MAIL_PORT),
});
