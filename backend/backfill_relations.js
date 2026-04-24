import prisma from './prisma/client.js';

async function backfill() {
  try {
    console.log('Starting backfill of eventRequestId...');
    
    // Get all published event requests
    const requests = await prisma.eventRequest.findMany({
      where: { status: 'PUBLISHED' }
    });
    
    console.log(`Found ${requests.length} published event requests.`);
    
    let linkedCount = 0;
    for (const request of requests) {
      // Try to find matching event by title and submittedBy
      const event = await prisma.event.findFirst({
        where: {
          title: request.title,
          submittedBy: request.submittedBy,
          eventRequestId: null 
        }
      });
      
      if (event) {
        await prisma.event.update({
          where: { id: event.id },
          data: { eventRequestId: request.id }
        });
        linkedCount++;
        console.log(`Linked Event "${event.title}" (ID: ${event.id}) to Request ID ${request.id}`);
      }
    }
    
    console.log(`Successfully linked ${linkedCount} events.`);
  } catch (error) {
    console.error('Error during backfill:', error);
  } finally {
    process.exit(0);
  }
}

backfill();
