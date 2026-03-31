import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

const DEFAULT_SQLITE_URL = "file:./dev.db";
const PRISMA_DIRECTORY = path.resolve(process.cwd(), "prisma");

function resolveSqliteUrl(url: string) {
  if (!url.startsWith("file:")) {
    return url;
  }

  const databasePath = url.slice("file:".length);

  if (
    databasePath === "" ||
    databasePath === ":memory:" ||
    databasePath.startsWith("/") ||
    /^[A-Za-z]:/.test(databasePath)
  ) {
    return url;
  }

  const [relativePath, search = ""] = databasePath.split("?");
  const absolutePath = path.resolve(PRISMA_DIRECTORY, relativePath);

  return `file:${absolutePath}${search ? `?${search}` : ""}`;
}

export function getDatabaseUrl() {
  return resolveSqliteUrl(process.env.DATABASE_URL ?? DEFAULT_SQLITE_URL);
}

export function createSqliteAdapter() {
  return new PrismaBetterSqlite3(
    {
      url: getDatabaseUrl(),
    },
    {
      // Our SQLite database was created with Prisma's built-in driver, which stores
      // DateTime values as unix epoch milliseconds. Keep the adapter aligned.
      timestampFormat: "unixepoch-ms",
    },
  );
}
