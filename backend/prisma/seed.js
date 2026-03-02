import prisma from './client.js';
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

        // 3. Seed Sample Events
        const sampleEvents = [
            {
                title: "AI & Robotics Workshop",
                description: "Hands-on session exploring the future of artificial intelligence and autonomous robotics. Perfect for beginners and enthusiasts!",
                date: new Date("2024-10-24T10:00:00Z"),
                category: "TECH",
                location: "Engineering Block, Hall A",
                image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
                registeredCount: 124
            },
            {
                title: "Intra-University Sprint Meet",
                description: "The annual track and field competition. Come witness the fastest sprinters on campus battle for the gold medal.",
                date: new Date("2024-10-28T09:00:00Z"),
                category: "SPORTS",
                location: "Main Sports Complex",
                image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
                registeredCount: 350
            },
            {
                title: "Midnight Canvas: Live Painting",
                description: "A serene night of art and creativity. Students from all departments are invited to paint live under the stars.",
                date: new Date("2024-11-02T19:00:00Z"),
                category: "ARTS",
                location: "Central Plaza Garden",
                image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800",
                registeredCount: 42
            },
            {
                title: "Battle of the Bands: Auditions",
                description: "The music club is looking for the best talent on campus. Auditions for the upcoming annual music festival.",
                date: new Date("2024-11-05T15:00:00Z"),
                category: "MUSIC",
                location: "Auditorium 2",
                image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
                registeredCount: 15
            },
            {
                title: "International Relations Mock UN",
                description: "Debate world issues and represent different nations in this immersive Model United Nations simulation.",
                date: new Date("2024-11-08T08:00:00Z"),
                category: "DEBATE",
                location: "Humanities Seminar Room",
                image: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&q=80&w=800",
                registeredCount: 88
            },
            {
                title: "24h Hackathon: Build for Campus",
                description: "Team up and build solutions that make university life easier. Food, caffeine, and coding - all provided!",
                date: new Date("2024-11-12T09:00:00Z"),
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
