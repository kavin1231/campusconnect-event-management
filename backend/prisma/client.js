import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: ['warn', 'error'],
});

export default prisma;
