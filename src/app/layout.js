import { Bricolage_Grotesque, Hanken_Grotesk, Space_Mono } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700", "800"],
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

const mono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata = {
  title: "SmartSpend AI — Your money, finally understood",
  description: "SmartSpend AI tracks every rupee, reads your habits, and tells you exactly what to do next. The AI finance assistant for students and young professionals.",
};

export const viewport = {
  themeColor: "#0C1116",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-ink text-mist antialiased font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}