import {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} from "../../config/env.js";
import { Pool, type PoolClient } from "pg";

type Config = {
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
  connectionString?: string;
  ssl?: any;
  types?: any;
  statement_timeout?: number;
  query_timeout?: number;
  lock_timeout?: number;
  application_name?: string;
  connectionTimeoutMillis?: number;
  keepAliveInitialDelayMillis?: number;
  idle_in_transaction_session_timeout?: number;
  client_encoding?: string;
  fallback_application_name?: string;
  options?: string;
  idleTimeoutMillis?: number;
  max?: number;
  min?: number;
};

const config: Config = {
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: "localhost",
  port: 5432,
  database: POSTGRES_DB,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool: Pool = new Pool(config);

export function getClient(): Promise<PoolClient> {
  return pool.connect();
}
