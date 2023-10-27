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
  TOKEN_TELEGRAM: process.env.TOKEN_TELEGRAM,
  URL_FRONTEND: process.env.URL_FRONTEND
});
