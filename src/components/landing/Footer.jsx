"use client";

import { Sparkles } from "lucide-react";

const cols = [
  {
    title: "Product",
    links: ["Features", "AI assistant", "Health score", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line py-14">
      <div className="mx-auto max-w-container px-5 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-sage/15 text-sage">
                <Sparkles size={16} />
              </span>
              <span className="font-display text-lg font-bold text-mist">
                SmartSpend<span className="text-sage"> AI</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted">
              The AI finance assistant that helps you spend smart and stress
              less.
            </p>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-semibold text-mist">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted transition-colors hover:text-mist"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} SmartSpend AI. All rights reserved.</span>
          <span>Built as a final-year project — designed to feel like a product.</span>
        </div>
      </div>
    </footer>
  );
}
