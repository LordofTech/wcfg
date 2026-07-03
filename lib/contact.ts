import type { Vehicle } from "@/lib/inventory";

export const CONTACT_EMAIL = "jamail@wcfgbizbrokers.com";
export const CONTACT_PHONE_DISPLAY = "+1 (832) 566-7163";
export const CONTACT_PHONE_TEL = "tel:+18325667163";
export const CONTACT_WEBSITE = "https://www.wcfgbrokers.com";

export const telHref = CONTACT_PHONE_TEL;

export function mailtoHref(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return query ? `mailto:${CONTACT_EMAIL}?${query}` : `mailto:${CONTACT_EMAIL}`;
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
