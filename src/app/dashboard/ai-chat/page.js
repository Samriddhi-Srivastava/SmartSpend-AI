"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Send, Bot } from "lucide-react";

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi! I am your AI financial assistant. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: messages.length + 1, type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const botMsg = {
        id: messages.length + 2,
        type: "bot",
        text: "This is a demo response. Real AI coming soon!",
      };
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-line p-6">
        <h1 className="font-display text-3xl font-bold text-mist flex items-center gap-3">
          <Bot className="text-sage" size={32} />
          AI Financial Assistant
        </h1>
        <p className="text-muted mt-2">Ask me anything about your finances!</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-md px-4 py-3 rounded-lg text-sm ${
              msg.type === "user"
                ? "bg-sage text-ink"
                : "bg-white/10 text-mist border border-line"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-mist px-4 py-3 rounded-lg border border-line">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-muted rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-line p-6">
        <form onSubmit={handleSend} className="flex gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about your spending..."
            disabled={loading}
            className="flex-1 bg-white/5 border border-line rounded-lg px-4 py-3 text-mist placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-sage/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-sage text-ink font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
