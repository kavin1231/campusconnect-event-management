import prisma from "../prisma/client.js";
import fs from "fs";

async function main() {
  try {
    const vals = await prisma.$queryRaw`SELECT enum_range(NULL::"Role")`;
    const exists =
      await prisma.$queryRaw`SELECT to_regclass('public."PresidentApplication"')`;
    const output = { vals, exists };
    fs.writeFileSync("db-check.json", JSON.stringify(output, null, 2));
    console.log("written db-check.json");
  } catch (e) {
    fs.writeFileSync("db-check-error.txt", e.toString());
    console.error("error occurred", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
