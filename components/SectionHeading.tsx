"use client";

import { motion } from "framer-motion";
import { luxuryEase } from "@/lib/motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  id?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  id,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: luxuryEase }}
      className={`mb-12 flex max-w-3xl flex-col gap-4 md:mb-16 ${alignment}`}
    >
      {eyebrow ? (
        <p className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light">
          {eyebrow}
        </p>
      ) : null}
      <div className="divider-gold w-24" />
      <h2 className="font-display text-3xl font-medium tracking-wide text-ivory sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl font-sans text-sm font-light leading-relaxed text-mist sm:text-base">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
