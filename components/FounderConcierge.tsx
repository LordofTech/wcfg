"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Check,
  Crown,
  Lock,
  UserRound,
} from "lucide-react";
import { fadeUpContainer, fadeUpItem } from "@/lib/motion";

const promises = [
  "Discretion in every detail",
  "Access to the world's finest vehicles",
  "Transparent, trustworthy, reliable",
  "White-glove delivery nationwide",
  "Long-term relationship and support",
] as const;

const ctaIcons = [
  { icon: Lock, label: "Private access" },
  { icon: Calendar, label: "By appointment" },
  { icon: UserRound, label: "Personal service" },
  { icon: Crown, label: "Concierge level" },
] as const;

export default function FounderConcierge() {
  return (
    <section
      className="relative scroll-mt-28 px-6 py-16 md:px-8 md:py-24"
      aria-labelledby="founder-concierge-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-pitch via-charcoal/30 to-pitch"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="overflow-hidden rounded-sm border border-gold-light/30 bg-charcoal/40 shadow-glass"
        >
          <div className="grid gap-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.5fr)_minmax(0,0.88fr)]">
            {/* Our promise */}
            <motion.div
              variants={fadeUpItem}
              className="border-b border-gold-light/20 p-8 md:p-10 lg:border-b-0 lg:border-r"
            >
              <p className="font-sans text-[10px] font-light uppercase tracking-luxury-wide text-gold-light">
                Our Promise To You
              </p>
              <h2
                id="founder-concierge-heading"
                className="mt-3 font-display text-2xl font-medium tracking-wide text-ivory md:text-[1.65rem]"
              >
                Exceptional vehicles.
                <span className="block text-gold-gradient">Extraordinary service.</span>
              </h2>
              <ul className="mt-8 space-y-4">
                {promises.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-gold-light/30 bg-pitch/50 text-gold-light">
                      <Check size={14} strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="font-sans text-xs font-light uppercase tracking-luxury text-ivory/90 sm:text-[11px]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Founder + avatar */}
            <motion.div
              variants={fadeUpItem}
              className="border-b border-gold-light/20 p-8 md:p-10 lg:border-b-0 lg:border-r"
            >
              <p className="font-sans text-[10px] font-light uppercase tracking-luxury-wide text-gold-light">
                Founder&apos;s Message
              </p>

              <div className="mt-8 grid items-start gap-8 md:grid-cols-[minmax(11rem,15rem)_minmax(0,1fr)] md:gap-10 lg:gap-12">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[15rem] shrink-0 overflow-hidden rounded-sm border border-gold-light/40 bg-pitch shadow-gold-sm md:mx-0">
                  <Image
                    src="/jamail-avatar.webp"
                    alt="Jamail Luxury Autos"
                    fill
                    sizes="(max-width: 768px) 240px, 240px"
                    className="object-cover object-center"
                  />
                </div>

                <div className="flex min-w-0 flex-col justify-center space-y-6 md:py-1">
                  <div>
                    <span
                      className="font-display text-4xl leading-none text-gold-light/70 md:text-[2.75rem]"
                      aria-hidden
                    >
                      &ldquo;
                    </span>
                    <blockquote className="mt-2 max-w-none font-sans text-[15px] font-light leading-[1.8] text-ivory/92 md:text-base md:leading-[1.85]">
                      At WCFG, trust is not given, it&apos;s earned. My team and I
                      are committed to combining expertise in rare automobiles with
                      uncompromising value and service.
                    </blockquote>
                  </div>

                  <div className="border-t border-gold-light/25 pt-6">
                    <p className="font-display text-2xl font-medium tracking-wide text-gold-gradient md:text-[1.75rem]">
                      Jamail
                    </p>
                    <p className="mt-2 font-sans text-xs font-light uppercase tracking-[0.22em] text-gold-light">
                      Luxury Autos
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA panel */}
            <motion.div
              variants={fadeUpItem}
              className="flex flex-col justify-center bg-gold-gradient/5 p-8 md:p-10"
            >
              <p className="font-sans text-[10px] font-light uppercase tracking-luxury-wide text-gold-light">
                Let&apos;s Find Your Next
              </p>
              <h3 className="mt-2 font-display text-2xl font-medium leading-snug tracking-wide text-ivory">
                Extraordinary Vehicle
              </h3>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {ctaIcons.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-sm border border-gold-light/20 bg-pitch/40 px-3 py-2.5"
                  >
                    <Icon size={14} className="shrink-0 text-gold-light" strokeWidth={1.5} />
                    <span className="font-sans text-[9px] font-light uppercase tracking-luxury text-mist">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/#consultation"
                className="mt-8 inline-flex items-center justify-center bg-gold-gradient px-6 py-3.5 font-sans text-[11px] font-medium uppercase tracking-luxury text-pitch transition-shadow duration-300 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
              >
                Schedule Your Consultation →
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 text-center font-sans text-[10px] font-light uppercase tracking-luxury-wide text-gold-light/90 sm:text-[11px]"
        >
          Private access · Personal service · Exceptional results
        </motion.p>
      </div>
    </section>
  );
}
