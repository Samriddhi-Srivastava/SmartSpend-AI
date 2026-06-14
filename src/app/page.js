import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Philosophy from "@/components/landing/Philosophy";
import Features from "@/components/landing/Features";
import AIShowcase from "@/components/landing/AIShowcase";
import HealthScore from "@/components/landing/HealthScore";
import Groups from "@/components/landing/Groups";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-ink">
      <Navbar />
      <Hero />
      <Philosophy />
      <Features />
      <AIShowcase />
      <HealthScore />
      <Groups />
      <CTA />
      <Footer />
    </main>
  );
}
