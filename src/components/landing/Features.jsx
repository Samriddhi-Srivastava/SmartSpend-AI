"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  Users,
  LineChart,
  Repeat,
  ScanLine,
  Bell,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const features = [
  {
    icon: Wallet,
    title: "Effortless expense tracking",
    desc: "Log spending in seconds with categories, notes, and receipts. Recurring bills are detected and added for you.",
    span: "md:col-span-3",
  },
  {
    icon: LineChart,
    title: "Analytics that explain",
    desc: "Weekly, monthly and yearly breakdowns with overspending alerts and spending heatmaps.",
    span: "md:col-span-3",
  },
  {
    icon: Users,
    title: "Smarter group splits",
    desc: "Split bills with friends, track who owes what, and settle up with optimised, fewest-transaction payouts.",
    span: "md:col-span-2",
  },
  {
    icon: ScanLine,
    title: "Auto-categorisation",
    desc: "Every transaction sorts itself into the right bucket — no manual tagging.",
    span: "md:col-span-2",
  },
  {
    icon: Bell,
    title: "Bills, never missed",
    desc: "Upcoming payments surface before they're due, so late fees stop happening.",
    span: "md:col-span-2",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-container px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sage">
            One place for everything
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-mist sm:text-5xl">
            Replace five disconnected apps with one calm system.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06} className={f.span}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group h-full rounded-2xl glass p-7 transition-colors hover:border-sage/30"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-sage/12 text-sage transition-colors group-hover:bg-sage/20">
                  <f.icon size={20} />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-mist">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {f.desc}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
