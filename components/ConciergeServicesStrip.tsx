"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Diamond,
  Globe2,
  Handshake,
  RefreshCw,
  Search,
  Truck,
} from "lucide-react";
import { fadeUpContainer, fadeUpItem } from "@/lib/motion";

const services = [
  { title: "Vehicle Acquisition", description: "Rare & exotic sourcing", icon: Search },
  { title: "Private Sourcing", description: "Global network access", icon: Globe2 },
  { title: "Due Diligence", description: "Inspection & verification", icon: ClipboardCheck },
  { title: "Expert Negotiation", description: "Best value secured", icon: Handshake },
  { title: "Nationwide Delivery", description: "White-glove logistics", icon: Truck },
  { title: "Trade-In & Upgrade", description: "Seamless transitions", icon: RefreshCw },
  { title: "Collector Search", description: "Exotic & limited editions", icon: Diamond },
] as const;

export default function ConciergeServicesStrip() {
  return (
    <section
      id="concierge"
      className="relative scroll-mt-28 border-y border-gold-light/15 bg-charcoal/25 px-6 py-14 md:px-8 md:py-16"
      aria-labelledby="concierge-strip-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="text-center"
        >
          <motion.div variants={fadeUpItem} className="mx-auto max-w-2xl border border-gold-light/35 px-6 py-4">
            <p className="font-display text-lg font-medium tracking-wide text-gold-gradient sm:text-xl">
              One Source. Endless Possibilities.
            </p>
          </motion.div>
          <motion.p
            variants={fadeUpItem}
            id="concierge-strip-heading"
            className="mt-5 font-sans text-[10px] font-light uppercase tracking-luxury-wide text-gold-light"
          >
            Our Concierge Services
          </motion.p>
        </motion.div>

        <motion.ul
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.li
                key={service.title}
                variants={fadeUpItem}
                className="flex flex-col items-center rounded-sm border border-gold-light/15 bg-pitch/50 px-4 py-5 text-center transition-colors hover:border-gold-light/30 hover:bg-pitch/70"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-gold-light/25 text-gold-light">
                  <Icon size={20} strokeWidth={1.25} aria-hidden />
                </span>
                <p className="mt-4 font-sans text-[10px] font-medium uppercase tracking-luxury text-gold-light">
                  {service.title}
                </p>
                <p className="mt-2 font-sans text-[10px] font-light leading-relaxed text-mist">
                  {service.description}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
