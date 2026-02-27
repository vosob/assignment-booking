export interface AppConfig {
  JWT_SECRET: string;
  JWT_ACCESS_TOKEN_TTL: string;
  JWT_REFRESH_TOKEN_TTL: string;
  DATABASE_URL: string;
}
