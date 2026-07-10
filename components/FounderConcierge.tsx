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
  "Long-term relationship & support",
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
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,0.95fr)]">
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
              <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[200px] shrink-0 overflow-hidden rounded-sm border border-gold-light/35 shadow-gold-sm sm:mx-0">
                  <Image
                    src="/jamail-avatar.webp"
                    alt="Jamail Luxury Autos"
                    fill
                    sizes="200px"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pitch/50 via-transparent to-transparent" />
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className="font-display text-5xl leading-none text-gold-light/80"
                    aria-hidden
                  >
                    &ldquo;
                  </span>
                  <blockquote className="font-sans text-sm font-light leading-relaxed text-ivory/90 sm:text-[15px]">
                    At WCFG, trust is not given — it&apos;s earned. My team and I are
                    committed to combining expertise in rare automobiles with
                    uncompromising value and service.
                  </blockquote>
                  <div className="mt-6 border-t border-gold-light/20 pt-5">
                    <p className="font-display text-xl font-medium tracking-wide text-gold-gradient sm:text-2xl">
                      Jamail
                    </p>
                    <p className="mt-1 font-sans text-[11px] font-light uppercase tracking-luxury-wide text-gold-light">
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
