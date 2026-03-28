import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

(async () => {
    try {
        const adminEmail = 'admin@nexora.edu';
        
        console.log('Attempting to create user with:');
        console.log({ email: adminEmail, name: 'System Admin', password: 'hashed', role: 'SYSTEM_ADMIN' });
        
        const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: { password: 'hashed_admin123' },
            create: {
                email: adminEmail,
                name: 'System Admin',
                password: 'hashed_admin123',
                role: 'SYSTEM_ADMIN',
            },
        });
        
        console.log('Success! Created user:', admin);
    } catch (error) {
        console.error('Error:', error.message);
        console.error('Full error:', error);
    } finally {
        await prisma.$disconnect();
    }
})();
