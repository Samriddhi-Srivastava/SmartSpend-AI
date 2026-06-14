"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const members = [
  { name: "You", amount: "+₹740", positive: true },
  { name: "Aarav", amount: "−₹420", positive: false },
  { name: "Meera", amount: "−₹320", positive: false },
];

export default function Groups() {
  return (
    <section className="relative py-28">
      <div className="mx-auto grid max-w-container items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        {/* visual */}
        <Reveal className="order-2 lg:order-1">
          <div className="glass rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-semibold text-mist">
                Goa Trip
              </p>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">
                3 members
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {members.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-sage/15 text-sm font-semibold text-sage">
                      {m.name[0]}
                    </span>
                    <span className="text-sm text-mist">{m.name}</span>
                  </div>
                  <span
                    className={`font-mono text-sm font-semibold ${
                      m.positive ? "text-sage" : "text-amber"
                    }`}
                  >
                    {m.amount}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-5 flex items-center gap-2 rounded-xl border border-sage/20 bg-sage/[0.06] px-4 py-3 text-sm text-mist"
            >
              <Check size={16} className="text-sage" />
              Simplified to <b className="text-sage">2 payments</b> instead of 4.
            </motion.div>
          </div>
        </Reveal>

        {/* copy */}
        <Reveal delay={0.1} className="order-1 lg:order-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">
            Shared finances
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-mist sm:text-5xl">
            Split with friends. Settle without the maths.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Create a group, add shared expenses, and SmartSpend works out the
            fewest payments needed to clear every debt. Optional income-based
            splitting keeps things fair when budgets differ.
          </p>
          <ul className="mt-7 space-y-3 text-mist">
            {[
              "Optimised debt simplification",
              "Real-time settlement tracking",
              "Fair, income-aware splitting",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-sage/15 text-sage">
                  <Check size={14} />
                </span>
                <span className="text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
