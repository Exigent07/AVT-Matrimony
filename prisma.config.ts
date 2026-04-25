import "dotenv/config";
import { defineConfig } from "prisma/config";

const prismaConfig = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
};

export default defineConfig(prismaConfig as never);
