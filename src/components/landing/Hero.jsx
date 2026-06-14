"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import Counter from "@/components/ui/Counter";

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // gentle parallax on the visual cluster
  const yVisual = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-36 pb-24 sm:pt-44">
      {/* ambient gradient orbs */}
      <div className="orb left-[-10%] top-[2%] h-[420px] w-[420px] bg-sage/25" />
      <div className="orb right-[-8%] top-[18%] h-[360px] w-[360px] bg-amber/15 [animation-delay:3s]" />
      <div className="absolute inset-0 grid-bg opacity-60" />

      <div className="relative mx-auto grid max-w-container grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ---- Left: copy ---- */}
        <motion.div style={{ y: yText }}>
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            AI finance assistant for students &amp; young professionals
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-5xl font-extrabold leading-[1.04] tracking-tight text-mist sm:text-6xl"
          >
            Your money,
            <br />
            <span className="text-gradient">finally understood.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted"
          >
            SmartSpend AI tracks every rupee, reads your spending habits, and
            tells you exactly what to do next — like a finance team that fits in
            your pocket.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#cta"
              className="group inline-flex items-center gap-2 rounded-full bg-sage px-6 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Get started free
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
            <a
              href="#philosophy"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 font-medium text-mist transition-colors hover:bg-white/5"
            >
              See how it thinks
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex items-center gap-6 text-xs text-muted"
          >
            <span>Free to start</span>
            <span className="h-3 w-px bg-line" />
            <span>Bank-grade security</span>
            <span className="h-3 w-px bg-line" />
            <span>Setup in 2 minutes</span>
          </motion.div>
        </motion.div>

        {/* ---- Right: visual cluster ---- */}
        <motion.div style={{ y: yVisual }} className="relative mx-auto w-full max-w-md">
          {/* main dashboard card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass float relative z-10 rounded-2xl p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Balance this month</p>
                <p className="mt-1 font-mono text-3xl font-bold text-mist">
                  ₹<Counter to={48250} />
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-sage/15 px-2.5 py-1 text-xs font-medium text-sage">
                <TrendingUp size={13} /> +12%
              </span>
            </div>

            {/* mini bar chart */}
            <div className="mt-6 flex h-24 items-end gap-2">
              {[40, 62, 48, 74, 55, 90, 68].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.7, delay: 0.5 + i * 0.07, ease: "easeOut" }}
                  className={`flex-1 rounded-t-md ${
                    i === 5 ? "bg-sage" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-muted">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i} className="flex-1 text-center">
                  {d}
                </span>
              ))}
            </div>
          </motion.div>

          {/* floating AI insight card — the signature "interpretation" */}
          <motion.div
            initial={{ opacity: 0, y: 24, x: 10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="glass float-slow float-delay absolute -bottom-10 -left-6 z-20 w-[78%] rounded-2xl border-amber/20 bg-amber/[0.06] p-4 shadow-card"
          >
            <div className="flex items-center gap-2 text-amber">
              <Sparkles size={15} />
              <span className="text-xs font-semibold uppercase tracking-wide">
                AI insight
              </span>
            </div>
            <p className="mt-2 text-sm leading-snug text-mist">
              Food spending is up <b className="text-amber">22%</b> this month.
              Trim dining by 15% to save{" "}
              <b className="font-mono text-amber">₹1,200</b>.
            </p>
          </motion.div>

          {/* small floating chip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="glass float absolute -right-4 top-6 z-20 rounded-xl px-3 py-2 text-xs text-muted [animation-delay:0.8s]"
          >
            <span className="text-sage">●</span> Saved ₹3,400 this week
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
