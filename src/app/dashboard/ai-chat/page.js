"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader } from "lucide-react";

/**
 * AI Chat Page
 * 
 * Route: /dashboard/ai-chat
 * 
 * Features:
 * - Chat interface with AI
 * - Ask about spending
 * - Get financial advice
 * - View chat history
 * 
 * Ready to integrate with backend AI service
 */

const suggestionPrompts = [
    "How can I reduce food spending?",
    "What's my best spending month?",
    "Should I increase my savings?",
    "Analyze my spending patterns",
];

export default function AIChatPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: "bot",
            text: "Hi! I'm your SmartSpend AI assistant. I can help you understand your spending, find ways to save, and achieve your financial goals. What would you like to know?",
            timestamp: new Date(Date.now() - 60000),
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            type: "user",
            text: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        // Simulate AI response delay
        setTimeout(() => {
            const botMessage = {
                id: messages.length + 2,
                type: "bot",
                text: generateAIResponse(input),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            setLoading(false);
        }, 1000);
    };

    const generateAIResponse = (userInput) => {
        const responses = {
            food: "Your food spending has increased by 22% this month. I recommend setting a daily budget for dining out. Reducing restaurant visits from 5 to 3 times per week could save you ₹800-1000 monthly!",
            spending: "Based on your data, your average monthly spending is ₹8,920. You're spending most on food (27.5%), followed by transport (20.2%). Would you like suggestions to optimize any category?",
            save: "You're currently saving 11% of your budget, which is good! To improve, you could reduce discretionary spending. Focus on food and entertainment first—these account for 37.7% of your expenses.",
            pattern: "Your spending patterns show: You spend more on weekends (32% of total), your peak spending day is usually Saturday, and you have consistent utilities expenses. Smart budgeting would help you save ₹1,500+ monthly.",
            default: "That's a great question! Based on your spending data, here's what I found: You have consistent patterns, and with a few adjustments, you could optimize further. Would you like specific recommendations for any category?",
        };

        const keyword = userInput.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (keyword.includes(key)) {
                return response;
            }
        }
        return responses.default;
    };

    const handleSuggestion = (prompt) => {
        setInput(prompt);
    };

    return (
        <div className="p-6 sm:p-8 h-full flex flex-col">
            {/* Header */}
            <div className="mb-6">
                <h1 className="font-display text-3xl font-bold text-mist">
                    AI Financial Assistant
                </h1>
                <p className="text-muted mt-2">
                    Ask me anything about your finances
                </p>
            </div>

            {/* Chat Container */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                    {messages.length === 1 && (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">💬</div>
                            <h3 className="text-lg font-semibold text-mist mb-2">
                                Let's talk about your money
                            </h3>
                            <p className="text-muted text-sm mb-6">
                                I can help you understand your spending, save more, and reach your goals
                            </p>

                            {/* Suggestion Prompts */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                                {suggestionPrompts.map((prompt) => (
                                    <button
                                        key={prompt}
                                        onClick={() => handleSuggestion(prompt)}
                                        className="glass rounded-lg p-4 border border-line hover:border-sage/50 hover:bg-sage/5 transition text-left"
                                    >
                                        <p className="text-sm font-medium text-mist">{prompt}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${message.type === "user"
                                        ? "bg-sage text-ink rounded-br-none"
                                        : "glass border border-white/[0.08] text-mist rounded-bl-none"
                                    }`}
                            >
                                <p className="text-sm">{message.text}</p>
                                <p
                                    className={`text-xs mt-2 ${message.type === "user"
                                            ? "text-ink/60"
                                            : "text-muted"
                                        }`}
                                >
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="glass border border-white/[0.08] rounded-lg rounded-bl-none px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Loader size={16} className="text-sage animate-spin" />
                                    <span className="text-sm text-muted">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask me about your spending..."
                        className="flex-1 bg-white/5 border border-line rounded-lg px-4 py-3 text-mist placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-sage/50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="bg-sage hover:bg-sage-deep disabled:opacity-50 text-ink font-semibold p-3 rounded-lg transition flex items-center justify-center"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}