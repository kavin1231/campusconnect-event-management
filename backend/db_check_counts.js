
import prisma from './prisma/client.js';

async function check() {
    try {
        const count = await prisma.studentEventRegistration.count({ where: { eventId: 101 } });
        const event = await prisma.event.findUnique({ 
            where: { id: 101 }, 
            select: { registeredCount: true, title: true } 
        });
        console.log('Event:', event.title);
        console.log('Actual Registrations (count):', count);
        console.log('Field RegisteredCount (cached):', event.registeredCount);
        
        const allEvents = await prisma.event.findMany({
            select: { id: true, title: true, registeredCount: true }
        });
        console.log('\nAll Events Summary:');
        for (const ev of allEvents) {
            const actual = await prisma.studentEventRegistration.count({ where: { eventId: ev.id } });
            console.log(`ID ${ev.id}: ${ev.title} - Cached: ${ev.registeredCount}, Actual: ${actual}`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}
check();
