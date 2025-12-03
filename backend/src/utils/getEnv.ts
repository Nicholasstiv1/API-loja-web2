import { cleanEnv, str, port } from "envalid";

export const getEnv = () =>
  cleanEnv(process.env, {
    DATABASE_URL: str(),
    SESSION_SECRET: str(),
    PORT: port({ default: 4000 }),
    CORS_ORIGIN: str({ default: "http://localhost:3000" }),
  });
