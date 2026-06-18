"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";

const factors = [
  { label: "Savings ratio", value: 84, note: "Strong" },
  { label: "Spending control", value: 71, note: "Good" },
  { label: "Recurring expenses", value: 58, note: "Watch this" },
  { label: "Debt load", value: 90, note: "Healthy" },
];

function Ring({ score = 72 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const R = 84;
  const C = 2 * Math.PI * R;
  const target = C - (score / 100) * C;

  return (
    <div ref={ref} className="relative grid place-items-center">
      <svg
        width="220"
        height="220"
        viewBox="0 0 200 200"
        className="-rotate-90"
      >
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="rgba(232,238,234,0.08)"
          strokeWidth="12"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7FD1A6" />
            <stop offset="100%" stopColor="#F0C088" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={inView ? { strokeDashoffset: target } : {}}
          transition={{ duration: reduce ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-mono text-5xl font-bold text-mist">
          <Counter to={score} />
        </p>
        <p className="text-sm text-muted">out of 100</p>
      </div>
    </div>
  );
}

export default function HealthScore() {
  return (
    <section id="health" className="relative py-28">
      <div className="mx-auto max-w-container px-5 sm:px-8">
        <div className="glass overflow-hidden rounded-2xl">
          <div className="grid items-center gap-10 p-8 sm:p-12 md:grid-cols-2">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">
                Financial health score
              </p>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-mist sm:text-5xl">
                One number that tells you where you stand
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
                We combine your savings rate, spending control, debt and
                recurring costs into a single score — then show you the exact
                levers to pull to raise it
              </p>

              <div className="mt-8 space-y-4">
                {factors.map((f, i) => (
                  <div key={f.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-mist">{f.label}</span>
                      <span className="text-muted">{f.note}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${f.value}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: 0.2 + i * 0.12,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-sage to-amber"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15} className="grid place-items-center">
              <Ring score={72} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
