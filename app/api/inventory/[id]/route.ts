import { NextResponse } from "next/server";
import { getVehicleById, vehicleToJson } from "@/lib/inventory-service";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    return NextResponse.json(
      { success: false, error: "Vehicle not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    vehicle: vehicleToJson(vehicle),
  });
}
