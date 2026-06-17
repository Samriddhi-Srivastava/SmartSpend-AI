"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function CTA() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleGetStarted = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  };

  return (
    <section id="cta" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute h-96 w-96 rounded-full bg-sage/10 blur-3xl" />
        <div className="absolute h-96 w-96 rounded-full bg-amber/5 blur-3xl" />
      </div>

      <Reveal className="relative mx-auto max-w-container px-5 sm:px-8">
        <div className="text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-mist dark:text-slate-100 mb-6">
            Ready to take control?
          </h2>
          <p className="text-lg text-muted dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Join thousands of students and young professionals who are already
            making smarter financial decisions with SmartSpend AI.
          </p>

          <button
            onClick={handleGetStarted}
            className="group inline-flex items-center gap-2 rounded-full bg-sage dark:bg-sage/80 hover:bg-sage-deep dark:hover:bg-sage px-8 py-4 font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-95"
          >
            Get started free
            <ArrowRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

          <p className="text-sm text-muted dark:text-slate-400 mt-6">
            No credit card required. Start tracking today.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
