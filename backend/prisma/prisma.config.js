require("dotenv").config();
console.log("Prisma config loaded, DATABASE_URL=", process.env.DATABASE_URL);
const { defineConfig } = require("prisma/config");

module.exports = defineConfig({
  schema: "schema.prisma",
  migrations: {
    path: "migrations",
    seed: "node seed.js",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
