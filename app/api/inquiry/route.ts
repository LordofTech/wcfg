import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { COUNTRY_DIAL_CODES } from "@/lib/country-dial-codes";

export const runtime = "nodejs";

const SALES_INQUIRY_EMAIL = "sales@wcfgluxautos.com";
const DEFAULT_SMTP_HOST = "smtp.gmail.com";
const DEFAULT_SMTP_PORT = 587;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitize(value: unknown, max = 140): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function resolveCountryByCode(code: string): string | null {
  if (!code) return null;
  const country = COUNTRY_DIAL_CODES.find(
    (entry) => entry.code.toLowerCase() === code.toLowerCase()
  );
  return country?.name ?? null;
}

function inferCountryFromIpHeaders(request: Request): {
  countryCode: string | null;
  countryName: string | null;
} {
  const countryCode =
    request.headers.get("x-vercel-ip-country")?.trim() ||
    request.headers.get("cf-ipcountry")?.trim() ||
    null;

  return {
    countryCode,
    countryName: countryCode ? resolveCountryByCode(countryCode) : null,
  };
}

function inferCountryFromPhone(phone: string): {
  dialCode: string | null;
  countryNames: string[];
} {
  const normalized = phone.replace(/[^\d+]/g, "");
  if (!normalized.startsWith("+")) {
    return { dialCode: null, countryNames: [] };
  }

  const dialCodes = [...new Set(COUNTRY_DIAL_CODES.map((entry) => entry.dialCode))].sort(
    (a, b) => b.length - a.length
  );

  const matchedDialCode = dialCodes.find((dialCode) => normalized.startsWith(dialCode));
  if (!matchedDialCode) {
    return { dialCode: null, countryNames: [] };
  }

  const countries = [...new Set(
    COUNTRY_DIAL_CODES.filter((entry) => entry.dialCode === matchedDialCode).map(
      (entry) => entry.name
    )
  )];

  return {
    dialCode: matchedDialCode,
    countryNames: countries,
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const record = body as Record<string, unknown>;
  const fullName = sanitize(record.fullName, 120);
  const email = sanitize(record.email, 180).toLowerCase();
  const phone = sanitize(record.phone, 40);
  const vehicle = sanitize(record.vehicle, 180);
  const vehicleId = sanitize(record.vehicleId, 80);
  const ipCountry = inferCountryFromIpHeaders(request);
  const phoneCountry = inferCountryFromPhone(phone);

  const ipCountryLabel = ipCountry.countryName
    ? `${ipCountry.countryName}${ipCountry.countryCode ? ` (${ipCountry.countryCode})` : ""}`
    : ipCountry.countryCode || "Unknown";

  const phoneCountryLabel =
    phoneCountry.countryNames.length > 0
      ? `${phoneCountry.countryNames.join(", ")}${phoneCountry.dialCode ? ` (${phoneCountry.dialCode})` : ""}`
      : "Unknown";

  if (!fullName || !email || !phone || !vehicle) {
    return NextResponse.json(
      {
        success: false,
        error: "Name, email, phone number, and selected vehicle are required.",
      },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { success: false, error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  if (!smtpUser || !smtpPass) {
    console.error("Inquiry email skipped: SMTP_USER / SMTP_PASS are not configured.");
    return NextResponse.json(
      {
        success: false,
        error: "Email service is temporarily unavailable. Please try again shortly.",
      },
      { status: 503 }
    );
  }

  const host = process.env.SMTP_HOST?.trim() || DEFAULT_SMTP_HOST;
  const port = Number(process.env.SMTP_PORT?.trim() || DEFAULT_SMTP_PORT);
  const from = process.env.SMTP_FROM?.trim() || "WCFG Sales <sales@wcfgluxautos.com>";

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1814;">
      <h1 style="font-size:20px;font-weight:500;margin:0 0 8px;">New Vehicle Inquiry</h1>
      <p style="margin:0 0 20px;color:#6b6560;font-size:14px;">
        A customer submitted an inquiry from the WCFG website.
      </p>
      <table style="width:100%;border-collapse:collapse;background:#faf8f5;border:1px solid #e8e4dc;">
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#6b6560;font-size:13px;width:40%;">Full Name</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#1a1814;font-size:14px;font-weight:500;">${escapeHtml(fullName)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#6b6560;font-size:13px;width:40%;">Phone</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#1a1814;font-size:14px;font-weight:500;">${escapeHtml(phone)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#6b6560;font-size:13px;width:40%;">Email</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#1a1814;font-size:14px;font-weight:500;">${escapeHtml(email)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#6b6560;font-size:13px;width:40%;">Country from IP</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#1a1814;font-size:14px;font-weight:500;">${escapeHtml(ipCountryLabel)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#6b6560;font-size:13px;width:40%;">Country from Phone Code</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#1a1814;font-size:14px;font-weight:500;">${escapeHtml(phoneCountryLabel)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#6b6560;font-size:13px;width:40%;">Selected Vehicle</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#1a1814;font-size:14px;font-weight:500;">${escapeHtml(vehicle)}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;color:#6b6560;font-size:13px;width:40%;">Vehicle Reference ID</td>
          <td style="padding:8px 12px;color:#1a1814;font-size:14px;font-weight:500;">${escapeHtml(vehicleId || "N/A")}</td>
        </tr>
      </table>
    </div>
  `;

  const text = [
    "New Vehicle Inquiry",
    "",
    `Full Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Country from IP: ${ipCountryLabel}`,
    `Country from Phone Code: ${phoneCountryLabel}`,
    `Selected Vehicle: ${vehicle}`,
    `Vehicle Reference ID: ${vehicleId || "N/A"}`,
  ].join("\n");

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from,
      to: SALES_INQUIRY_EMAIL,
      replyTo: email,
      subject: `New WCFG vehicle inquiry: ${vehicle}`,
      html,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry email send failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to send inquiry right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
