import { Globe, Mail, MapPin, Phone } from "lucide-react";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_WEBSITE,
  CONTACT_WEBSITE_DISPLAY,
  FOOTER_CONTACT_EMAILS,
  mailtoHref,
  telHref,
} from "@/lib/contact";

export default function FlyerContactBar() {
  const email = FOOTER_CONTACT_EMAILS[0];

  return (
    <section
      className="border-y border-gold-light/20 bg-charcoal/50 px-6 py-5 md:px-8"
      aria-label="Contact information"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <ul className="grid gap-4 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:gap-8">
          <li>
            <a
              href={telHref}
              className="inline-flex items-center gap-2.5 font-sans text-xs font-light text-ivory/90 transition-colors hover:text-gold-light"
            >
              <Phone size={15} className="text-gold-light" strokeWidth={1.5} aria-hidden />
              {CONTACT_PHONE_DISPLAY}
            </a>
          </li>
          <li>
            <a
              href={mailtoHref(undefined, undefined, email.mailto)}
              className="inline-flex items-center gap-2.5 font-sans text-xs font-light text-ivory/90 transition-colors hover:text-gold-light"
            >
              <Mail size={15} className="text-gold-light" strokeWidth={1.5} aria-hidden />
              {email.display}
            </a>
          </li>
          <li>
            <a
              href={CONTACT_WEBSITE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-sans text-xs font-light text-ivory/90 transition-colors hover:text-gold-light"
            >
              <Globe size={15} className="text-gold-light" strokeWidth={1.5} aria-hidden />
              {CONTACT_WEBSITE_DISPLAY}
            </a>
          </li>
        </ul>
        <p className="inline-flex items-start gap-2.5 font-sans text-[10px] font-light uppercase tracking-luxury text-mist sm:text-[11px]">
          <MapPin size={15} className="mt-0.5 shrink-0 text-gold-light" strokeWidth={1.5} aria-hidden />
          <span>
            Serving clients nationwide
            <span className="mt-1 block text-gold-light/90">Based in Texas</span>
          </span>
        </p>
      </div>
    </section>
  );
}
