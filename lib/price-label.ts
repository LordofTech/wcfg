/** True when price is a dollar amount (not inquiry / call-for-price). */
export function isListedPrice(priceLabel: string): boolean {
  return /^\$[\d,]+$/.test(priceLabel.trim());
}

export function priceLabelClassName(priceLabel: string): string {
  return isListedPrice(priceLabel)
    ? "font-display text-2xl font-bold tracking-wide text-gold-light sm:text-3xl"
    : "font-sans text-base font-bold uppercase tracking-luxury text-gold-light sm:text-lg";
}
