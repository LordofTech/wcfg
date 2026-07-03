import type { Metadata } from "next";
import InventoryListing from "@/components/InventoryListing";
import InventoryShell from "@/components/InventoryShell";
import { listVehicles } from "@/lib/inventory-service";

export const metadata: Metadata = {
  title: "Curated Inventory",
  description:
    "Browse WCFG’s personally vetted luxury inventory — Mercedes-Benz, Ferrari, Rolls-Royce, Lamborghini, Corvette, Porsche, and Bentley.",
};

export default async function InventoryIndexPage() {
  const vehicles = await listVehicles();

  return (
    <InventoryShell>
      <InventoryListing
        vehicles={vehicles}
        backHref="/#inventory"
        backLabel="Back to home"
      />
    </InventoryShell>
  );
}
