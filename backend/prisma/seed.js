import prisma from './client.js';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('Start seeding...');

    try {
        const saltRounds = 10;

        // 1. Seed System Admin
        const adminEmail = 'admin@nexora.edu';
        const adminPassword = await bcrypt.hash('admin123', saltRounds);

        const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: { password: adminPassword },
            create: {
                email: adminEmail,
                name: 'NEXORA Admin',
                password: adminPassword,
                role: 'SYSTEM_ADMIN',
            },
        });
        console.log(`System Admin created with email: ${admin.email}`);

        console.log(`System Admin created with email: ${admin.email}`);

        // 3. Seed Operations Manager
        const operationsEmail = 'operations@nexora.edu';
        const operationsPassword = await bcrypt.hash('admin123', saltRounds);

        const operationsManager = await prisma.user.upsert({
            where: { email: operationsEmail },
            update: { password: operationsPassword },
            create: {
                email: operationsEmail,
                name: 'NEXORA Operations Manager',
                password: operationsPassword,
                role: 'OPERATIONS_MANAGER',
            },
        });
        console.log(`Operations Manager created with email: ${operationsManager.email}`);

        // 4. Seed Event Organizer (Club President)
        const organizerEmail = 'organizer@nexora.edu';
        const organizerPassword = await bcrypt.hash('admin123', saltRounds);

        const organizer = await prisma.user.upsert({
            where: { email: organizerEmail },
            update: { password: organizerPassword },
            create: {
                email: organizerEmail,
                name: 'Main Event Organizer',
                password: organizerPassword,
                role: 'CLUB_PRESIDENT',
            },
        });
        console.log(`Event Organizer created with email: ${organizer.email}`);

        // 5. Seed Default Student
        const studentEmail = 'student@nexora.edu';
        const studentPassword = await bcrypt.hash('admin123', saltRounds);

        const student = await prisma.student.upsert({
            where: { email: studentEmail },
            update: { password: studentPassword },
            create: {
                email: studentEmail,
                name: 'Default Student',
                password: studentPassword,
                studentId: 'ST12345',
                department: 'Software Engineering',
                year: 2,
            },
        });
        console.log(`Default Student created with email: ${student.email}`);

        // 4. Seed Sample Events
        const sampleEvents = [
            {
                title: "AI & Robotics Workshop",
                description: "Hands-on session exploring the future of artificial intelligence and autonomous robotics. Perfect for beginners and enthusiasts!",
                date: new Date("2026-03-28T10:00:00Z"),
                category: "TECH",
                location: "Engineering Block, Hall A",
                image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
                registeredCount: 124
            },
            {
                title: "Intra-University Sprint Meet",
                description: "The annual track and field competition. Come witness the fastest sprinters on campus battle for the gold medal.",
                date: new Date("2026-04-02T09:00:00Z"),
                category: "SPORTS",
                location: "Main Sports Complex",
                image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
                registeredCount: 350
            },
            {
                title: "Midnight Canvas: Live Painting",
                description: "A serene night of art and creativity. Students from all departments are invited to paint live under the stars.",
                date: new Date("2026-04-10T19:00:00Z"),
                category: "ARTS",
                location: "Central Plaza Garden",
                image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800",
                registeredCount: 42
            },
            {
                title: "Battle of the Bands: Auditions",
                description: "The music club is looking for the best talent on campus. Auditions for the upcoming annual music festival.",
                date: new Date("2026-04-15T15:00:00Z"),
                category: "MUSIC",
                location: "Auditorium 2",
                image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
                registeredCount: 15
            },
            {
                title: "International Relations Mock UN",
                description: "Debate world issues and represent different nations in this immersive Model United Nations simulation.",
                date: new Date("2026-04-20T08:00:00Z"),
                category: "DEBATE",
                location: "Humanities Seminar Room",
                image: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&q=80&w=800",
                registeredCount: 88
            },
            {
                title: "24h Hackathon: Build for Campus",
                description: "Team up and build solutions that make university life easier. Food, caffeine, and coding - all provided!",
                date: new Date("2026-04-25T09:00:00Z"),
                category: "TECH",
                location: "CS Innovation Lab",
                image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
                registeredCount: 200
            }
        ];

        console.log('Seeding sample events...');
        for (const event of sampleEvents) {
            await prisma.event.upsert({
                where: { id: sampleEvents.indexOf(event) + 1 }, // Using index as ID for simplicity in seed
                update: event,
                create: event
            });
        }
        console.log('Finished seeding sample events.');

        // 5. Seed sample operations data
        const organization = await prisma.organization.upsert({
            where: {
                contactEmail: 'soc@nexora.edu',
            },
            update: {
                name: 'School of Computing Society',
                faculty: 'Computing',
                contactEmail: 'soc@nexora.edu',
                themePrimary: '#FF6B35',
                themeAccent: '#1E293B',
            },
            create: {
                name: 'School of Computing Society',
                faculty: 'Computing',
                contactEmail: 'soc@nexora.edu',
                contactPhone: '+94-11-000-0000',
                description: 'Operations pilot organization for sponsorship and vendor workflows.',
                themePrimary: '#FF6B35',
                themeAccent: '#1E293B',
                managerId: operationsManager.id,
            },
        });

        await prisma.sponsorshipLead.upsert({
            where: {
                organizationId_sponsorName: {
                    organizationId: organization.id,
                    sponsorName: 'TechNova Lanka',
                },
            },
            update: {
                sponsorName: 'TechNova Lanka',
                stage: 'PROPOSAL',
                packageTier: 'GOLD',
                expectedValue: 2500,
                managedById: operationsManager.id,
                organizationId: organization.id,
            },
            create: {
                organizationId: organization.id,
                sponsorName: 'TechNova Lanka',
                sponsorEmail: 'partnerships@technova.lk',
                contactPerson: 'Ari Perera',
                stage: 'PROPOSAL',
                packageTier: 'GOLD',
                expectedValue: 2500,
                benefitsChecklist: {
                    logoPlacement: true,
                    keynoteSlot: false,
                    socialMentions: true,
                },
                managedById: operationsManager.id,
            },
        });

        await prisma.vendorPartner.upsert({
            where: {
                organizationId_name: {
                    organizationId: organization.id,
                    name: 'Campus Pizza Co.',
                },
            },
            update: {
                name: 'Campus Pizza Co.',
                agreementStatus: 'UNDER_REVIEW',
            },
            create: {
                organizationId: organization.id,
                name: 'Campus Pizza Co.',
                contactName: 'Nimali Fernando',
                contactPhone: '+94-77-123-4567',
                contactEmail: 'ops@campuspizza.lk',
                requirements: {
                    firePermit: true,
                    foodSafety: true,
                    powerNeed: '2kW',
                },
                agreementStatus: 'UNDER_REVIEW',
            },
        });

        await prisma.organizationBudget.upsert({
            where: {
                organizationId_category: {
                    organizationId: organization.id,
                    category: 'Event Operations',
                },
            },
            update: {
                plannedAmount: 1800,
                actualAmount: 1300,
            },
            create: {
                organizationId: organization.id,
                category: 'Event Operations',
                plannedAmount: 1800,
                actualAmount: 1300,
                notes: 'Food zone setup and stage logistics',
                createdById: operationsManager.id,
            },
        });

        await prisma.stallSlot.upsert({
            where: {
                organizationId_slotCode_eventDate_startTime: {
                    organizationId: organization.id,
                    slotCode: 'A-01',
                    eventDate: new Date('2026-04-25T00:00:00Z'),
                    startTime: new Date('2026-04-25T08:00:00Z'),
                },
            },
            update: {
                slotCode: 'A-01',
                location: 'Main Courtyard',
                eventDate: new Date('2026-04-25T00:00:00Z'),
                startTime: new Date('2026-04-25T08:00:00Z'),
                endTime: new Date('2026-04-25T15:00:00Z'),
                organizationId: organization.id,
            },
            create: {
                organizationId: organization.id,
                slotCode: 'A-01',
                location: 'Main Courtyard',
                eventDate: new Date('2026-04-25T00:00:00Z'),
                startTime: new Date('2026-04-25T08:00:00Z'),
                endTime: new Date('2026-04-25T15:00:00Z'),
            },
        });
        console.log('Finished seeding operations module sample data.');

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
