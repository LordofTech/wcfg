import type { Vehicle } from "@/lib/inventory";

/** Primary business inbox — vehicle CTAs, lead notifications, default mailto. */
export const CONTACT_EMAIL_PRIMARY = "jay@wcfgluxauto.com";

/** Secondary Gmail inbox — shown as an alternative in the footer. */
export const CONTACT_EMAIL_SECONDARY = "Jay.luxeauto@gmail.com";

/** mailto target for the secondary address (normalized casing). */
export const CONTACT_EMAIL_SECONDARY_MAILTO = "jay.luxeauto@gmail.com";

/** @deprecated Use CONTACT_EMAIL_PRIMARY — kept for imports that expect a single email. */
export const CONTACT_EMAIL = CONTACT_EMAIL_PRIMARY;

export const FOOTER_CONTACT_EMAILS = [
  {
    display: CONTACT_EMAIL_PRIMARY,
    mailto: CONTACT_EMAIL_PRIMARY,
  },
  {
    display: CONTACT_EMAIL_SECONDARY,
    mailto: CONTACT_EMAIL_SECONDARY_MAILTO,
  },
] as const;

export const CONTACT_PHONE_DISPLAY = "+1 (832) 566-7163";
export const CONTACT_PHONE_TEL = "tel:+18325667163";
export const CONTACT_WEBSITE = "https://www.wcfgbrokers.com";

export const telHref = CONTACT_PHONE_TEL;

export function mailtoHref(
  subject?: string,
  body?: string,
  email: string = CONTACT_EMAIL_PRIMARY
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
