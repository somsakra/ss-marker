import dotenv from "dotenv";

dotenv.config();

export const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, APP_URL, SECRET_TOKEN } =
  process.env;
