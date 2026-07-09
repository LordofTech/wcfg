import type { Vehicle } from "@/lib/inventory";

/** Public mailto target — generic business inbox only (never a personal address). */
export const CONTACT_EMAIL_MAILTO =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "concierge@wcfgbizbrokers.com";

/** Client-facing contact label — no personal names or private addresses. */
export const CONTACT_EMAIL_DISPLAY = "Concierge Desk";

/** @deprecated Use CONTACT_EMAIL_MAILTO */
export const CONTACT_EMAIL = CONTACT_EMAIL_MAILTO;

export const FOOTER_CONTACT_EMAIL = {
  display: CONTACT_EMAIL_DISPLAY,
  mailto: CONTACT_EMAIL_MAILTO,
} as const;

export const FOOTER_CONTACT_EMAILS = [FOOTER_CONTACT_EMAIL] as const;

export const CONTACT_PHONE_DISPLAY = "+1 (832) 566-7163";
export const CONTACT_PHONE_TEL = "tel:+18325667163";
export const CONTACT_WEBSITE = "https://wcfgbizbrokers.com/";
export const CONTACT_WEBSITE_DISPLAY = "wcfgbizbrokers.com";

export const telHref = CONTACT_PHONE_TEL;

export function mailtoHref(
  subject?: string,
  body?: string,
  email: string = CONTACT_EMAIL_MAILTO
): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return query ? `mailto:${email}?${query}` : `mailto:${email}`;
}

export function mailtoVehicleInterest(vehicle: Pick<Vehicle, "id" | "brand" | "model" | "year">): string {
  const subject = `Interest in ${vehicle.year} ${vehicle.brand} ${vehicle.model}`;
  const body = [
    "Hello WCFG,",
    "",
    "I am interested in the following vehicle:",
    "",
    `Brand: ${vehicle.brand}`,
    `Model: ${vehicle.model}`,
    `Year: ${vehicle.year}`,
    `Reference ID: ${vehicle.id}`,
    "",
    "Please contact me with availability and next steps.",
    "",
    "Thank you.",
  ].join("\n");

  return mailtoHref(subject, body);
}
