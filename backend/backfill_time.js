import prisma from './prisma/client.js';

async function backfillTime() {
  try {
    console.log('Starting backfill of Event startTime/endTime...');
    
    // Get all events linked to event requests
    const events = await prisma.event.findMany({
      where: { NOT: { eventRequestId: null } },
      include: { eventRequest: true }
    });
    
    console.log(`Found ${events.length} linked events.`);
    
    let updatedCount = 0;
    for (const event of events) {
      if (event.eventRequest) {
        await prisma.event.update({
          where: { id: event.id },
          data: {
            startTime: event.eventRequest.startTime,
            endTime: event.eventRequest.endTime
          }
        });
        updatedCount++;
        console.log(`Updated Event "${event.title}" with time ${event.eventRequest.startTime} - ${event.eventRequest.endTime}`);
      }
    }
    
    console.log(`Successfully updated ${updatedCount} events.`);
  } catch (error) {
    console.error('Error during backfill:', error);
  } finally {
    process.exit(0);
  }
}

backfillTime();
