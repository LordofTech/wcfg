import { Globe, Mail, MapPin, Phone } from "lucide-react";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_WEBSITE,
  CONTACT_WEBSITE_DISPLAY,
  FOOTER_CONTACT_EMAILS,
  mailtoHref,
  telHref,
} from "@/lib/contact";

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-gold-light/15 bg-charcoal">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-3xl font-medium tracking-wide text-gold-gradient">
            WCFG
          </p>
          <p className="mt-2 font-sans text-[10px] font-light uppercase tracking-luxury text-mist">
            Luxury Automobile Brokers
          </p>
          <p className="mt-6 max-w-xs font-sans text-sm font-light leading-relaxed text-mist">
            Based in Houston, Texas, delivering white-glove luxury vehicle
            sourcing and premium logistics tailored for discerning clients in
            Nigeria and beyond.
          </p>
        </div>

        <div>
          <p className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light">
            Contact
          </p>
          <div className="divider-gold mt-3 mb-6 w-16" />
          <ul className="space-y-4 font-sans text-sm font-light text-ivory/90">
            {FOOTER_CONTACT_EMAILS.map((entry) => (
              <li key={entry.mailto}>
                <a
                  href={mailtoHref(undefined, undefined, entry.mailto)}
                  className="inline-flex items-center gap-3 transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light"
                >
                  <Mail size={16} className="text-gold-light" strokeWidth={1.5} aria-hidden />
                  {entry.display}
                </a>
              </li>
            ))}
            <li>
              <a
                href={CONTACT_WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light"
              >
                <Globe size={16} className="text-gold-light" strokeWidth={1.5} aria-hidden />
                {CONTACT_WEBSITE_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={telHref}
                className="inline-flex items-center gap-3 transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light"
              >
                <Phone size={16} className="text-gold-light" strokeWidth={1.5} aria-hidden />
                {CONTACT_PHONE_DISPLAY}
              </a>
            </li>
            <li className="inline-flex items-start gap-3 text-mist">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-light" strokeWidth={1.5} aria-hidden />
              <span>
                Houston, Texas
                <br />
                Premium delivery to Nigeria &amp; international destinations
              </span>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light">
            Navigate
          </p>
          <div className="divider-gold mt-3 mb-6 w-16" />
          <ul className="space-y-3 font-sans text-sm font-light text-ivory/90">
            <li>
              <a href="/inventory" className="transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light">
                Curated Inventory
              </a>
            </li>
            <li>
              <a href="/#services" className="transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light">
                Premium Services
              </a>
            </li>
            <li>
              <a href="/#inventory" className="transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light">
                The WCFG Experience
              </a>
            </li>
            <li>
              <a href="/#consultation" className="transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light">
                Schedule a Consultation
              </a>
            </li>
            <li>
              <a href="/portal" className="transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:text-gold-light">
                Portal Login
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gold-gradient px-6 py-3 text-center">
        <p className="font-sans text-[10px] font-medium uppercase tracking-luxury text-pitch sm:text-[11px]">
          Concierge Service · Market Knowledge · Exclusive Access · Unmatched Experience
        </p>
      </div>

      <div className="border-t border-pitch/20 bg-pitch px-6 py-4 text-center">
        <p className="font-sans text-xs font-light text-mist">
          © {new Date().getFullYear()} WCFG Luxury Automobile Brokers. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
