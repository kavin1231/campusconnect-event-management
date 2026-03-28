import { execSync } from 'child_process';

try {
    console.log('Regenerating Prisma client...');
    const result = execSync('npx prisma generate --schema ./prisma/schema.prisma', {
        cwd: process.cwd(),
        stdio: 'inherit'
    });
    console.log('✅ Prisma client regenerated successfully!');
} catch (error) {
    console.error('Error:', error.message);
}
