/** True when price is a dollar amount (not inquiry / call-for-price). */
export function isListedPrice(priceLabel: string): boolean {
  return /^\$[\d,]+$/.test(priceLabel.trim());
}

/** Typography for listed dollar amounts — shared with year-of-manufacture labels. */
export const listedPriceClassName =
  "font-display text-2xl font-bold tracking-wide text-white sm:text-3xl";

export function priceLabelClassName(priceLabel: string): string {
  return isListedPrice(priceLabel)
    ? listedPriceClassName
    : "font-sans text-base font-bold uppercase tracking-luxury text-white sm:text-lg";
}
