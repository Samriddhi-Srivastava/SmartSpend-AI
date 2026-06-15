"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { useAuth } from "@/context/AuthContext"; 
import { useRouter } from "next/navigation"; 

export default function CTA() {
    const router = useRouter();
    const { user } = useAuth();

const handleGetStarted = () => {
  if (user) {
    router.push("/dashboard");   // if user logged in → go to dashboard
  } else {
    router.push("/signup");      // if not logged in → go to signup
  }
};

  return (
    <section id="cta" className="relative overflow-hidden py-28">
      <div className="orb left-1/2 top-1/2 h-[420px] w-[520px] -translate-x-1/2 -translate-y-1/2 bg-sage/15" />

      <Reveal className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2 className="font-display text-4xl font-bold tracking-tight text-mist sm:text-6xl">
          Take control of your money
          <br />
          <span className="text-gradient">starting today.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          Join thousands of students and young professionals who finally
          understand where their money goes — and what to do about it.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleGetStarted}
            className="group inline-flex items-center gap-2 rounded-full bg-sage px-7 py-4 font-semibold text-ink transition-transform hover:scale-[1.03]"
          >
            Get started free
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
          <a
            href="#features"
            className="inline-flex items-center rounded-full glass px-7 py-4 font-medium text-mist hover:bg-white/5"
          >
            Explore features
          </a>
        </div>
        <p className="mt-5 text-xs text-muted">
          No credit card required · Free forever for personal use
        </p>
      </Reveal>
    </section>
  );
}
