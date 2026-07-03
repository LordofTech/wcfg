export interface ConsultationLeadInput {
  fullName: string;
  phone: string;
  marque: string;
  budget: string;
  deliveryLocation: string;
}

export interface ConsultationLeadRecord {
  full_name: string;
  phone: string;
  marque: string;
  budget_range: string;
  delivery_location: string;
  status: "new";
  source: "website";
}

const LIMITS = {
  fullName: { min: 2, max: 120 },
  phone: { min: 7, max: 40 },
  marque: { min: 1, max: 80 },
  budget: { min: 1, max: 80 },
  deliveryLocation: { min: 1, max: 80 },
} as const;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string";
}

function trimField(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export function parseConsultationBody(
  body: unknown
): { data: ConsultationLeadInput } | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Invalid request body." };
  }

  const record = body as Record<string, unknown>;
  const fullName = record.fullName;
  const phone = record.phone;
  const marque = record.marque;
  const budget = record.budget;
  const deliveryLocation = record.deliveryLocation;

  if (
    !isNonEmptyString(fullName) ||
    !isNonEmptyString(phone) ||
    !isNonEmptyString(marque) ||
    !isNonEmptyString(budget) ||
    !isNonEmptyString(deliveryLocation)
  ) {
    return { error: "All fields are required." };
  }

  const data: ConsultationLeadInput = {
    fullName: trimField(fullName, LIMITS.fullName.max),
    phone: trimField(phone, LIMITS.phone.max),
    marque: trimField(marque, LIMITS.marque.max),
    budget: trimField(budget, LIMITS.budget.max),
    deliveryLocation: trimField(deliveryLocation, LIMITS.deliveryLocation.max),
  };

  if (data.fullName.length < LIMITS.fullName.min) {
    return { error: "Please enter your full name." };
  }
  if (data.phone.length < LIMITS.phone.min) {
    return { error: "Please enter a valid phone or WhatsApp number." };
  }
  if (!data.marque) {
    return { error: "Please select a desired marque." };
  }
  if (!data.budget) {
    return { error: "Please select a budget range." };
  }
  if (!data.deliveryLocation) {
    return { error: "Please select a delivery location." };
  }

  return { data };
}

export function toConsultationLeadRecord(
  input: ConsultationLeadInput
): ConsultationLeadRecord {
  return {
    full_name: input.fullName,
    phone: input.phone,
    marque: input.marque,
    budget_range: input.budget,
    delivery_location: input.deliveryLocation,
    status: "new",
    source: "website",
  };
}
