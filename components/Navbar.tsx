"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { luxuryEase } from "@/lib/motion";

const NAV_LINKS = [
  { label: "Curated Inventory", href: "#inventory" },
  { label: "Premium Services", href: "#services" },
  { label: "The WCFG Experience", href: "#experience" },
  { label: "Portal Login", href: "/portal" },
] as const;

export default function Navbar() {
  const [compressed, setCompressed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCompressed(latest > 48);
  });

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: luxuryEase }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-6"
      >
        <motion.nav
          animate={{
            paddingTop: compressed ? 10 : 16,
            paddingBottom: compressed ? 10 : 16,
            paddingLeft: compressed ? 20 : 28,
            paddingRight: compressed ? 20 : 28,
          }}
          transition={{ duration: 0.35, ease: luxuryEase }}
          className="glass-strong flex w-full max-w-6xl items-center justify-between rounded-sm border border-gold-light/20 shadow-glass"
          aria-label="Primary"
        >
          <a
            href="#top"
            className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
            onClick={closeMobile}
          >
            <span className="font-display text-2xl font-medium leading-none tracking-wide text-gold-gradient transition-opacity group-hover:opacity-90 sm:text-[1.65rem]">
              WCFG
            </span>
            <span className="mt-1 hidden font-sans text-[9px] font-light uppercase tracking-luxury text-mist sm:block">
              Luxury Automobile Brokers
            </span>
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-sans text-[11px] font-light uppercase tracking-luxury text-ivory/80 transition-colors duration-300 hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#consultation"
              className="hidden bg-gold-gradient px-5 py-2.5 font-sans text-[10px] font-medium uppercase tracking-luxury text-pitch transition-shadow duration-300 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-pitch sm:inline-flex"
            >
              Schedule a Consultation
            </a>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-sm border border-gold-light/30 p-2 text-gold-light transition-colors hover:bg-gold-light/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-pitch/90 backdrop-blur-md lg:hidden"
          >
            <motion.div
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.3, ease: luxuryEase }}
              className="glass-strong mx-4 mt-24 rounded-sm border border-gold-light/20 p-8"
            >
              <ul className="flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={closeMobile}
                      className="block font-sans text-sm font-light uppercase tracking-luxury text-ivory transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#consultation"
                onClick={closeMobile}
                className="mt-8 flex w-full items-center justify-center bg-gold-gradient px-5 py-3.5 font-sans text-[11px] font-medium uppercase tracking-luxury text-pitch transition-shadow hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight"
              >
                Schedule a Consultation
              </a>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
