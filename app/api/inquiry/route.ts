import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
  const phone = sanitize(record.phone, 40);
  const vehicle = sanitize(record.vehicle, 180);
  const vehicleId = sanitize(record.vehicleId, 80);

  if (!fullName || !phone || !vehicle) {
    return NextResponse.json(
      {
        success: false,
        error: "Name, phone number, and selected vehicle are required.",
      },
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
  const from = process.env.SMTP_FROM?.trim() || `WCFG Sales <${smtpUser}>`;

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
    `Phone: ${phone}`,
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
