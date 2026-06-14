"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const chat = [
  { role: "user", text: "Where am I overspending this month?" },
  {
    role: "ai",
    text: "Mostly on food delivery — ₹4,200 across 18 orders, up 22% from last month. Cooking twice a week could save you around ₹1,500.",
  },
  { role: "user", text: "How financially healthy am I?" },
  {
    role: "ai",
    text: "You're at 72/100 — solid. Your savings rate is strong, but recurring subscriptions are quietly eating 9% of income.",
  },
];

const prompts = [
  "Suggest a budget for me",
  "Predict next month's expenses",
  "Can I afford a ₹15k trip?",
  "Where can I save more?",
];

export default function AIShowcase() {
  return (
    <section id="ai" className="relative overflow-hidden py-28">
      <div className="orb left-[40%] top-[20%] h-[380px] w-[380px] bg-amber/12" />

      <div className="relative mx-auto grid max-w-container items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        {/* copy */}
        <Reveal>
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber">
            <Sparkles size={15} /> AI assistant
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-mist sm:text-5xl">
            Ask your money anything.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            No spreadsheets, no jargon. Just ask a question in plain language and
            get a clear, personalised answer grounded in your real spending.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {prompts.map((p) => (
              <span
                key={p}
                className="rounded-full glass px-4 py-2 text-sm text-mist transition-colors hover:border-amber/30"
              >
                {p}
              </span>
            ))}
          </div>
        </Reveal>

        {/* chat mockup */}
        <Reveal delay={0.1}>
          <div className="glass rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber/15 text-amber">
                <Sparkles size={14} />
              </span>
              <span className="text-sm font-medium text-mist">
                SmartSpend Assistant
              </span>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-sage">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sage" />
                online
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {chat.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.25 }}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <p
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-sage text-ink"
                        : "rounded-bl-sm bg-white/[0.06] text-mist"
                    }`}
                  >
                    {m.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
