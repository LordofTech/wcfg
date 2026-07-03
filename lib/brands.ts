export const MARQUES = [
  "Mercedes-Benz",
  "Ferrari",
  "Rolls-Royce",
  "Lamborghini",
  "Corvette",
  "Porsche",
  "Bentley",
] as const;

export type Marque = (typeof MARQUES)[number];

/** Tailwind gradient fragments for card / badge accents */
export const MARQUE_ACCENTS: Record<Marque, string> = {
  "Mercedes-Benz": "from-zinc-300/35 via-zinc-500/15 to-transparent",
  Ferrari: "from-red-600/40 via-red-900/20 to-transparent",
  "Rolls-Royce": "from-stone-200/30 via-amber-200/10 to-transparent",
  Lamborghini: "from-yellow-400/35 via-amber-700/20 to-transparent",
  Corvette: "from-red-500/35 via-zinc-800/20 to-transparent",
  Porsche: "from-amber-500/30 via-stone-600/20 to-transparent",
  Bentley: "from-emerald-700/35 via-green-900/20 to-transparent",
};
