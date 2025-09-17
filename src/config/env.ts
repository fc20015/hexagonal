import dotenv from "dotenv";

dotenv.config();

export const HOST = process.env.HOST || "localhost";
export const POSTGRES_USER = process.env.POSTGRES_USER || "user";
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || "password";
export const POSTGRES_DB = process.env.POSTGRES_DB || "database";
export const JWT_SECRET = process.env.JWT_SECRET || "hotfix_teste";
export const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || 30;
export const MAX_NUM_ACTIVE_SESSIONS = process.env.MAX_NUM_ACTIVE_SESSIONS || 3;
// export const PGADMIN_DEFAULT_EMAIL = process.env.PGADMIN_DEFAULT_EMAIL;
// export const PGADMIN_DEFAULT_PASSWORD = process.env.PGADMIN_DEFAULT_PASSWORD;
