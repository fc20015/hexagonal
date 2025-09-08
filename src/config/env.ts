import dotenv from "dotenv";

dotenv.config();

export const HOST = process.env.HOST || "localhost";
export const POSTGRES_USER = process.env.POSTGRES_USER || "user";
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "password";
export const POSTGRES_DB = process.env.POSTGRES_DB || "database";
export const PGADMIN_DEFAULT_EMAIL = process.env.PGADMIN_DEFAULT_EMAIL;
export const PGADMIN_DEFAULT_PASSWORD = process.env.PGADMIN_DEFAULT_PASSWORD;
