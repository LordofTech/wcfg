import { NextResponse } from "next/server";
import { isBrandSlug } from "@/lib/brands";
import { listVehicles, vehicleToJson } from "@/lib/inventory-service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand");

  if (brand && !isBrandSlug(brand)) {
    return NextResponse.json(
      { success: false, error: "Unknown brand slug." },
      { status: 400 }
    );
  }

  const vehicles = await listVehicles(brand ?? undefined);

  return NextResponse.json({
    success: true,
    count: vehicles.length,
    vehicles: vehicles.map(vehicleToJson),
  });
}
