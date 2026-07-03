import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal",
  description: "Secure client portal for WCFG Luxury Automobile Brokers.",
};

export default function PortalPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="glass-strong w-full max-w-md rounded-sm border border-gold-light/20 px-10 py-14 text-center">
        <p className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light">
          Client Portal
        </p>
        <div className="divider-gold my-8" />
        <h1 className="font-display text-4xl font-medium tracking-wide text-gold-gradient">
          WCFG
        </h1>
        <p className="mt-4 font-sans text-sm font-light leading-relaxed text-mist">
          The secure client portal is coming soon. For active sourcing requests,
          contact your advisor or schedule a consultation.
        </p>
        <div className="mt-10 flex flex-col gap-3">
          <Link
            href="/#consultation"
            className="inline-flex items-center justify-center bg-gold-gradient px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-luxury text-pitch transition-shadow hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
          >
            Schedule a Consultation
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-gold-light/40 px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-luxury text-gold-light transition-colors hover:bg-gold-light/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
