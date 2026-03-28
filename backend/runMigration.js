import prisma from './prisma/client.js';
import fs from 'fs';
import path from 'path';

const migrationFile = path.join('prisma/migrations/20260323_create_event_review/migration.sql');
const sql = fs.readFileSync(migrationFile, 'utf-8');

async function runMigration() {
    try {
        console.log('Running migration...');
        const statements = sql.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                console.log('Executing:', statement.substring(0, 50) + '...');
                await prisma.$executeRawUnsafe(statement);
            }
        }
        
        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

runMigration();
