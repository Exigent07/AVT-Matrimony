import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const prismaConfig = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
};

export default defineConfig(prismaConfig as never);
