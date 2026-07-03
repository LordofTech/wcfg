"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Car,
  Check,
  Globe2,
  Handshake,
  HeartHandshake,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { luxuryEase } from "@/lib/motion";

const services = [
  { label: "Luxury & Exotic Vehicle Sourcing", icon: Search },
  { label: "Nationwide / Global Vehicle Search", icon: Globe2 },
  { label: "Expert Negotiation", icon: Handshake },
  { label: "Trade-In Assistance", icon: Car },
  { label: "Pre-Purchase Inspection", icon: ShieldCheck },
  { label: "Financing & Leasing Solutions", icon: Wallet },
  { label: "International Delivery", icon: Truck },
  { label: "Concierge-Level Service", icon: Sparkles },
] as const;

const brokerBenefits = [
  "Access to off-market and hard-to-find vehicles",
  "Better pricing through expert negotiation",
  "Avoid costly mistakes",
  "Save time — we handle everything",
  "A seamless, stress-free experience",
  "Long-term relationship & support",
] as const;

const pillars = [
  "Exclusive Access",
  "Discreet & Professional",
  "Save Time & Money",
  "100% Client Focused",
] as const;

export default function WhyWCFG() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const quoteY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const servicesY = useTransform(scrollYProgress, [0, 1], [24, -16]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative scroll-mt-28 overflow-hidden px-6 py-24 md:px-8 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-pitch via-charcoal/40 to-pitch" aria-hidden />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Premium Services"
          title="The WCFG Difference"
          description="White-glove brokerage from first conversation to delivery — whether your destination is Lagos, Abuja, or anywhere our network reaches."
        />

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <motion.div style={{ y: servicesY }} className="glass rounded-sm p-8 md:p-10">
            <h3 className="font-display text-2xl font-medium tracking-wide text-gold-gradient">
              Our Services
            </h3>
            <div className="divider-gold my-5 w-16" />
            <ul className="space-y-4">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.li
                    key={service.label}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.05,
                      ease: luxuryEase,
                    }}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-gold-light/25 bg-pitch/50 text-gold-light">
                      <Icon size={16} strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="pt-1 font-sans text-sm font-light text-ivory/90">
                      {service.label}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: luxuryEase }}
            className="glass rounded-sm p-8 md:p-10"
          >
            <h3 className="font-display text-2xl font-medium tracking-wide text-gold-gradient">
              Why Work With A Broker?
            </h3>
            <div className="divider-gold my-5 w-16" />
            <ul className="space-y-4">
              {brokerBenefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.05,
                    ease: luxuryEase,
                  }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-gold-light/25 bg-pitch/50 text-gold-light">
                    <Check size={16} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="pt-1 font-sans text-sm font-light text-ivory/90">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.blockquote
          style={{ y: quoteY }}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: luxuryEase }}
          className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-sm border border-gold-light/35 bg-gold-gradient/10 px-8 py-10 text-center md:px-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-gold-radial" aria-hidden />
          <HeartHandshake
            className="relative mx-auto mb-5 text-gold-light"
            size={28}
            strokeWidth={1.25}
            aria-hidden
          />
          <p className="relative font-display text-xl font-medium leading-relaxed tracking-wide text-ivory sm:text-2xl md:text-[1.65rem]">
            &ldquo;We don&apos;t sell cars, we curate experiences. Your vision.
            Our network. The perfect vehicle. That&apos;s WCFG.&rdquo;
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            {pillars.map((pillar) => (
              <span
                key={pillar}
                className="rounded-sm border border-gold-light/25 bg-pitch/40 px-3 py-1.5 font-sans text-[9px] font-light uppercase tracking-luxury text-gold-light"
              >
                {pillar}
              </span>
            ))}
          </div>
        </motion.blockquote>
      </div>
    </section>
  );
}
