import prisma from '../prisma/client.js';

class ChatbotController {
    static async query(req, res) {
        try {
            const { text } = req.body;

            if (!text) {
                return res.status(400).json({ success: false, message: 'No query text provided' });
            }

            const query = text.toLowerCase();
            let response = '';
            let suggestedEvents = [];

            // 1. Fetch all events for processing
            const allEvents = await prisma.event.findMany({
                orderBy: { date: 'asc' }
            });

            // 2. Intent Identification & Matching
            if (query.includes('next') || query.includes('upcoming')) {
                const upcoming = allEvents.filter(e => new Date(e.date) >= new Date());
                if (upcoming.length > 0) {
                    response = `The next upcoming event is "${upcoming[0].title}" on ${new Date(upcoming[0].date).toLocaleDateString()}.`;
                    suggestedEvents = upcoming.slice(0, 3);
                } else {
                    response = "There are no upcoming events currently scheduled.";
                }
            }
            else if (query.includes('tech') || query.includes('software') || query.includes('code')) {
                suggestedEvents = allEvents.filter(e => e.category === 'TECH');
                response = `I found ${suggestedEvents.length} technical events for you.`;
            }
            else if (query.includes('sport') || query.includes('run') || query.includes('match')) {
                suggestedEvents = allEvents.filter(e => e.category === 'SPORTS');
                response = `There are ${suggestedEvents.length} sports events coming up.`;
            }
            else if (query.includes('music') || query.includes('band') || query.includes('audition')) {
                suggestedEvents = allEvents.filter(e => e.category === 'MUSIC');
                response = "We have some great musical events scheduled!";
            }
            else if (query.includes('art') || query.includes('paint')) {
                suggestedEvents = allEvents.filter(e => e.category === 'ARTS');
                response = "Unleash your creativity at these arts events!";
            }
            else if (query.includes('hello') || query.includes('hi')) {
                response = "Hello! I'm your CampusConnect assistant. Ask me about upcoming workshops, sports meets, or fests!";
            }
            else {
                // Fallback: Keyword search in title/description
                suggestedEvents = allEvents.filter(e =>
                    e.title.toLowerCase().includes(query) ||
                    e.description.toLowerCase().includes(query)
                );

                if (suggestedEvents.length > 0) {
                    response = `I found some events related to "${text}".`;
                } else {
                    response = "I'm sorry, I couldn't find any events matching that. Would you like to see all upcoming events?";
                    suggestedEvents = allEvents.filter(e => new Date(e.date) >= new Date()).slice(0, 3);
                }
            }

            res.status(200).json({
                success: true,
                response,
                events: suggestedEvents
            });

        } catch (error) {
            console.error('Chatbot error:', error);
            res.status(500).json({
                success: false,
                message: 'Error processing chatbot query',
                error: error.message
            });
        }
    }
}

export default ChatbotController;
