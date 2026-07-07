/** True when price is a dollar amount (not inquiry / call-for-price). */
export function isListedPrice(priceLabel: string): boolean {
  return /^\$[\d,]+$/.test(priceLabel.trim());
}

export function priceLabelClassName(priceLabel: string): string {
  return isListedPrice(priceLabel)
    ? "font-display text-lg font-medium tracking-wide text-gold-light"
    : "font-sans text-sm font-medium uppercase tracking-luxury text-gold-light/90";
}
