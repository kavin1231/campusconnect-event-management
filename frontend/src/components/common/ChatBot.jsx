import { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: "Hi! I'm your campus assistant. How can I help you today?" }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!inputText.trim() || loading) return;

        const userMessage = { id: Date.now(), type: 'user', text: inputText };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/chatbot/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText })
            });

            const data = await response.json();

            if (data.success) {
                const botMessage = {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: data.response,
                    events: data.events
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: "Sorry, I had trouble processing that request."
                }]);
            }
        } catch (error) {
            console.error("Chatbot query error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: "Network error. Please make sure the server is healthy."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <button
                className="chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Chatbot"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                )}
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>Campus Assistant 🚀</h3>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message ${msg.type}`}>
                                {msg.text}
                                {msg.events && msg.events.length > 0 && (
                                    <div className="event-suggestions">
                                        {msg.events.map(event => (
                                            <div key={event.id} className="event-suggestion-card">
                                                <h4>{event.title}</h4>
                                                <p>{new Date(event.date).toLocaleDateString()} @ {event.location}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="message bot">
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Ask about events..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <button type="submit" className="send-btn" disabled={loading || !inputText.trim()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
