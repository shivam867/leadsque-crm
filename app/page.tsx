import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import RoleSelector from "@/components/landing/RoleSelector";
import Statement from "@/components/landing/Statement";
import TierComparison from "@/components/landing/TierComparison";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import Divider from "@/components/landing/Divider";

export default function HomePage() {
  return (
    <>
      <Header />
      {/* Outer wrapper is relative so the absolute grid fills exactly the page content area */}
      <div className="relative">
        {/* Grid drawn once, absolutely covering the full page, behind everything */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.035,
            backgroundImage:
              "linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* No z-index on main — children stack naturally above the grid div above */}
        <main className="relative">
          <Hero />
          <Divider />
          <RoleSelector />
          <Divider />
          <Statement />
          <Divider />
          <TierComparison />
          <Divider />
          <HowItWorks />
          <Divider />
          <CTA />
          <Footer />
        </main>
      </div>
    </>
  );
}