"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function Philosophy() {
  return (
    <section id="philosophy" className="relative py-28">
      <div className="mx-auto max-w-container px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">
            The difference
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-mist sm:text-5xl">
            Most apps show you numbers.
            <br />
            <span className="text-muted">We tell you what they mean.</span>
          </h2>
        </Reveal>

        {/* before → after */}
        <div className="mt-16 grid items-center gap-6 md:grid-cols-[1fr_auto_1.3fr]">
          <Reveal delay={0.05}>
            <div className="glass rounded-2xl p-7">
              <p className="text-xs uppercase tracking-wide text-muted">
                A plain tracker
              </p>
              <p className="mt-4 font-mono text-2xl text-mist/70">
                Food expenses
              </p>
              <p className="mt-1 font-mono text-4xl font-bold text-mist/40 line-through decoration-muted/40">
                ₹5,000
              </p>
              <p className="mt-4 text-sm text-muted">
                Data, with no direction. You&apos;re left to figure out the rest.
              </p>
            </div>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sage/15 text-sage md:rotate-0"
          >
            <ArrowRight size={20} />
          </motion.div>

          <Reveal delay={0.15}>
            <div className="glass rounded-2xl border-sage/20 bg-sage/[0.05] p-7 shadow-glow">
              <p className="text-xs uppercase tracking-wide text-sage">
                SmartSpend AI
              </p>
              <p className="mt-4 text-2xl font-semibold leading-snug text-mist">
                Your food spending rose{" "}
                <span className="text-gradient">22% this month.</span>
              </p>
              <p className="mt-3 text-lg leading-relaxed text-muted">
                Reducing dining by just 15% would save you about{" "}
                <b className="font-mono text-sage">₹1,200</b> — enough to cover a
                month of your phone bill.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
