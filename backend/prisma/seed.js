import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('Start seeding...');

    try {
        const saltRounds = 10;

        // 1. Seed System Admin
        const adminEmail = 'admin@campusconnect.edu';
        const adminPassword = await bcrypt.hash('Admin@123', saltRounds);

        const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                email: adminEmail,
                name: 'System Admin',
                password: adminPassword,
                role: 'SYSTEM_ADMIN',
            },
        });
        console.log(`System Admin created with email: ${admin.email}`);

        // 2. Seed Event Organizer
        const organizerEmail = 'organizer@campusconnect.edu';
        const organizerPassword = await bcrypt.hash('Organizer@123', saltRounds);

        const organizer = await prisma.user.upsert({
            where: { email: organizerEmail },
            update: {},
            create: {
                email: organizerEmail,
                name: 'Event Organizer',
                password: organizerPassword,
                role: 'EVENT_ORGANIZER',
            },
        });
        console.log(`Event Organizer created with email: ${organizer.email}`);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
