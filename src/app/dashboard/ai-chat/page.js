"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Send, Bot, User, Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

const SUGGESTED_QUESTIONS = [
  "Where am I overspending?",
  "Can I save more this month?",
  "Suggest a budget for me",
  "How financially healthy am I?",
];

export default function AiChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your SmartSpend AI assistant. Ask me anything about your spending, budgeting, or financial habits — I'll look at your actual expense data to give you specific answers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          userEmail: session?.user?.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-mist dark:bg-slate-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Please log in to use AI Chat.</p>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-mist dark:bg-slate-950 p-6 lg:p-8">
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-1">
        <div className="mb-6">
          <h1 className="text-4xl font-boldtext-ink dark:text-slate-100  font-display">
            AI Chat
          </h1>
          <p className="text-muted dark:text-slate-400 mt-2">
            Ask me about your spending and get personalized advice
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1bg-mist dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4 overflow-y-auto space-y-4" style={{ minHeight: "400px", maxHeight: "55vh" }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-green-600 dark:text-green-400" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-green-600 dark:text-green-400" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your spending..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-3 rounded-lg transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}