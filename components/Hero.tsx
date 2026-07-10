"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUpContainer, fadeUpItem } from "@/lib/motion";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16 md:pb-20"
    >
      {/* Layered backdrop — existing brand texture + flyer night skyline */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/hero-backdrop.webp"
          alt=""
          fill
          priority
          className="object-cover object-[72%_center] opacity-[0.22]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pitch via-pitch/94 to-pitch/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-pitch via-transparent to-pitch/75" />
        <div className="absolute inset-0 bg-gold-radial opacity-50" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <motion.div
            variants={fadeUpContainer}
            initial="hidden"
            animate="show"
            className="max-w-xl lg:max-w-none"
          >
            <motion.p
              variants={fadeUpItem}
              className="font-sans text-[10px] font-light uppercase tracking-luxury-wide text-gold-light sm:text-[11px]"
            >
              Private Automotive Concierge
            </motion.p>
            <motion.p
              variants={fadeUpItem}
              className="mt-2 font-sans text-[9px] font-light uppercase tracking-luxury text-mist sm:text-[10px]"
            >
              Exceptional vehicles · Extraordinary service
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
              className="font-display text-3xl font-medium leading-[1.12] tracking-wide text-ivory sm:text-4xl md:text-[2.65rem]"
            >
              Your Vision.
              <br />
              Our Network.
              <br />
              <span className="text-gold-gradient">Perfectly Delivered.</span>
            </motion.h1>

            <motion.p
              variants={fadeUpItem}
              className="mt-7 max-w-xl font-sans text-sm font-light leading-relaxed text-mist sm:text-base"
            >
              WCFG is a private automotive concierge that sources, negotiates, and
              delivers the world&apos;s finest luxury and exotic vehicles with a
              white-glove experience from start to finish.
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
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div className="relative overflow-hidden rounded-sm border border-gold-light/35 bg-charcoal/30 shadow-gold">
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
                <Image
                  src="/flyer-hero-scene.webp"
                  alt="Luxury vehicle concierge at night with city skyline"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pitch/80 via-pitch/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-pitch/50 via-transparent to-transparent lg:from-pitch/30" />
              </div>
              <div className="absolute bottom-0 inset-x-0 border-t border-gold-light/25 bg-pitch/75 px-5 py-4 backdrop-blur-sm">
                <p className="font-sans text-[9px] font-light uppercase tracking-luxury-wide text-gold-light">
                  Curated by
                </p>
                <p className="font-display text-lg font-medium tracking-wide text-ivory">
                  Jamail <span className="text-gold-gradient">Luxury Autos</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-pitch to-transparent" />
    </section>
  );
}
