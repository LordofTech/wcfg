"use client";

import { useCallback, useState, type MouseEvent } from "react";
import { Phone } from "lucide-react";
import { CONTACT_PHONE_DISPLAY, telHref } from "@/lib/contact";

interface CallCtaLinkProps {
  className: string;
  iconSize?: number;
  defaultLabel?: string;
  showNumberByDefault?: boolean;
}

export default function CallCtaLink({
  className,
  iconSize = 15,
  defaultLabel = "Call",
  showNumberByDefault = false,
}: CallCtaLinkProps) {
  const [showPhoneLabel, setShowPhoneLabel] = useState(false);

  const handleClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setShowPhoneLabel(true);

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(CONTACT_PHONE_DISPLAY).catch(() => {
        // Clipboard access can fail in unsupported or restricted contexts.
      });
    }
  }, []);

  const label = showNumberByDefault || showPhoneLabel
    ? CONTACT_PHONE_DISPLAY
    : defaultLabel;

  return (
    <a
      href={telHref}
      onMouseEnter={() => setShowPhoneLabel(true)}
      onMouseLeave={() => setShowPhoneLabel(false)}
      onFocus={() => setShowPhoneLabel(true)}
      onBlur={() => setShowPhoneLabel(false)}
      onClick={handleClick}
      className={className}
      aria-label={`Call ${CONTACT_PHONE_DISPLAY}`}
      title="Click to copy phone number"
    >
      <Phone size={iconSize} strokeWidth={1.5} aria-hidden />
      {label}
    </a>
  );
}
