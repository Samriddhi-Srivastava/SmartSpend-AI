"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, LogOut } from "lucide-react";

const links = [
  { label: "How it thinks", href: "#philosophy" },
  { label: "Features", href: "#features" },
  { label: "AI assistant", href: "#ai" },
  { label: "Health score", href: "#health" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGetStarted = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto flex max-w-container items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-sage/15 text-sage">
              <Sparkles size={16} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-mist dark:text-slate-100">
              SmartSpend<span className="text-sage"> AI</span>
            </span>
          </a>
        </div>
      </motion.header>
    );
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className={`mx-auto flex max-w-container items-center justify-between px-5 py-4 transition-all duration-300 sm:px-8 ${
          scrolled ? "mt-3 rounded-full glass shadow-card" : "mt-0"
        }`}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-sage/15 text-sage">
            <Sparkles size={16} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-mist dark:text-slate-100">
            SmartSpend<span className="text-sage"> AI</span>
          </span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted dark:text-slate-400 transition-colors hover:text-mist dark:hover:text-slate-100"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {status === "loading" ? (
            <div className="h-8 w-24 bg-white/10 rounded-full animate-pulse" />
          ) : session ? (
            <>
              <div className="flex items-center gap-3 border-l border-line dark:border-slate-700 pl-3">
                <span className="text-sm text-muted dark:text-slate-400">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full bg-red-500/10 dark:bg-red-500/5 hover:bg-red-500/20 dark:hover:bg-red-500/10 text-red-400 px-4 py-2 text-sm font-medium transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="rounded-full bg-sage dark:bg-sage/80 hover:bg-sage-deep dark:hover:bg-sage px-4 py-2 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
                >
                  Dashboard
                </button>
              </div>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="text-sm text-muted dark:text-slate-400 transition-colors hover:text-mist dark:hover:text-slate-100"
              >
                Log in
              </a>
              <button
                onClick={handleGetStarted}
                className="rounded-full bg-sage dark:bg-sage/80 hover:bg-sage-deep dark:hover:bg-sage px-4 py-2 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
              >
                Get started
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="text-mist dark:text-slate-100 md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-2 rounded-2xl glass p-4 md:hidden"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-mist dark:text-slate-100 hover:bg-white/5 dark:hover:bg-slate-800/50"
              >
                {l.label}
              </a>
            ))}

            {status === "loading" ? (
              <div className="mt-4 h-8 bg-white/10 rounded-lg animate-pulse" />
            ) : session ? (
              <>
                <div className="mt-4 space-y-2 border-t border-line dark:border-slate-700 pt-4">
                  <p className="px-3 text-xs text-muted dark:text-slate-400">
                    {session.user?.name || session.user?.email}
                  </p>
                  <button
                    onClick={() => {
                      router.push("/dashboard");
                      setOpen(false);
                    }}
                    className="w-full rounded-full bg-sage dark:bg-sage/80 px-4 py-3 text-center font-semibold text-ink transition-transform hover:scale-[1.03]"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={async () => {
                      await handleLogout();
                      setOpen(false);
                    }}
                    className="flex items-center justify-center w-full gap-2 rounded-full bg-red-500/10 dark:bg-red-500/5 hover:bg-red-500/20 dark:hover:bg-red-500/10 text-red-400 px-4 py-3 font-medium transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
               <a 
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-mist dark:text-slate-100 hover:bg-white/5 dark:hover:bg-slate-800/50"
                >
                  Log in
                </a>
                <button
                  onClick={() => {
                    handleGetStarted();
                    setOpen(false);
                  }}
                  className="mt-2 w-full rounded-full bg-sage dark:bg-sage/80 px-4 py-3 text-center font-semibold text-ink transition-transform hover:scale-[1.03]"
                >
                  Get started
                </button>
              </>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
