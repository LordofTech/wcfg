import Link from "next/link";
import InventoryShell from "@/components/InventoryShell";

export default function InventoryNotFound() {
  return (
    <InventoryShell>
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="glass-strong w-full max-w-md rounded-sm border border-gold-light/20 px-10 py-14 text-center">
          <p className="font-sans text-[11px] font-light uppercase tracking-luxury text-gold-light">
            Not Found
          </p>
          <div className="divider-gold my-8" />
          <h1 className="font-display text-3xl font-medium tracking-wide text-ivory">
            Inventory unavailable
          </h1>
          <p className="mt-4 font-sans text-sm font-light leading-relaxed text-mist">
            That brand or vehicle is not in our current curated collection.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center bg-gold-gradient px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-luxury text-pitch transition-shadow hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
            >
              Browse inventory
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-gold-light/40 px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-luxury text-gold-light transition-colors hover:bg-gold-light/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
            >
              Return home
            </Link>
          </div>
        </div>
      </section>
    </InventoryShell>
  );
}
