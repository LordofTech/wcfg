export interface VehicleSpecItem {
  label: string;
  value: string;
}

export interface VehicleEquipmentGroup {
  title: string;
  items: string[];
}

export interface VehicleEquipmentCategory {
  title: string;
  groups: VehicleEquipmentGroup[];
}

export interface VehicleSpecs {
  overview: VehicleSpecItem[];
  equipment: VehicleEquipmentCategory[];
}

export type VehicleSpecsById = Record<string, VehicleSpecs>;
