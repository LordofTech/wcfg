"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUpContainer, fadeUpItem } from "@/lib/motion";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20"
    >
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-velvet via-pitch to-pitch" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_75%_40%,rgba(212,175,55,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-pitch via-pitch/95 to-pitch/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-pitch via-transparent to-pitch/80" />
        <div className="absolute inset-0 bg-gold-radial opacity-45" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 md:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.p
            variants={fadeUpItem}
            className="font-sans text-[10px] font-light uppercase tracking-luxury-wide text-gold-light sm:text-[11px]"
          >
            Your Trust · Our Expertise · Exceptional Results
          </motion.p>

          <motion.div variants={fadeUpItem} className="mt-8">
            <p className="font-display text-5xl font-medium tracking-wide text-gold-gradient sm:text-6xl md:text-7xl">
              WCFG
            </p>
            <p className="mt-2 font-sans text-[11px] font-light uppercase tracking-luxury text-mist">
              Luxury Automobile Brokers
            </p>
          </motion.div>

          <motion.div variants={fadeUpItem} className="divider-gold my-8 max-w-xs" />

          <motion.h1
            variants={fadeUpItem}
            className="font-display text-3xl font-medium leading-[1.15] tracking-wide text-ivory sm:text-4xl md:text-5xl lg:text-[3.25rem]"
          >
            Luxury Vehicles.
            <br />
            Personally Sourced.
            <br />
            <span className="text-gold-gradient">Professionally Delivered.</span>
          </motion.h1>

          <motion.p
            variants={fadeUpItem}
            className="mt-8 max-w-xl font-sans text-sm font-light leading-relaxed text-mist sm:text-base"
          >
            A white-glove automobile brokerage experience that takes the stress
            out of buying luxury and exotic vehicles. We find the right vehicle,
            negotiate the best value, and deliver an unmatched experience from
            start to finish.
          </motion.p>

          <motion.div
            variants={fadeUpItem}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <a
              href="#inventory"
              className="inline-flex items-center justify-center bg-gold-gradient px-8 py-3.5 font-sans text-[11px] font-medium uppercase tracking-luxury text-pitch transition-shadow duration-300 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
            >
              Explore Curated Stock
            </a>
            <a
              href="#consultation"
              className="inline-flex items-center justify-center border border-gold-light/50 bg-transparent px-8 py-3.5 font-sans text-[11px] font-medium uppercase tracking-luxury text-gold-light transition-all duration-300 hover:border-gold-light hover:bg-gold-light/10 hover:shadow-gold-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
            >
              Request Custom Sourcing
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUpItem}
          initial="hidden"
          animate="show"
          className="relative mx-auto hidden w-full max-w-md lg:block lg:max-w-none"
        >
          <div className="relative overflow-hidden rounded-sm border border-gold-light/20 bg-pitch/40 shadow-gold">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-pitch to-transparent"
              aria-hidden
            />
            <Image
              src="/brand-flyer-hero.webp"
              alt="Luxury vehicle showcase and marque partners"
              width={420}
              height={1024}
              priority
              className="h-auto w-full object-cover"
              sizes="(min-width: 1024px) 420px, 0px"
            />
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-pitch to-transparent" />
    </section>
  );
}
