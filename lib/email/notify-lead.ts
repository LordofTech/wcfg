import { Resend } from "resend";
import type { ConsultationLeadInput } from "@/lib/consultation";

const DEFAULT_NOTIFY_EMAIL = "jamail@wcfgbizbrokers.com";
const DEFAULT_FROM_EMAIL = "WCFG Consultations <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildLeadEmailHtml(lead: ConsultationLeadInput): string {
  const rows: Array<[string, string]> = [
    ["Full Name", lead.fullName],
    ["WhatsApp / Phone", lead.phone],
    ["Desired Marque", lead.marque],
    ["Budget Range", lead.budget],
    ["Delivery Location", lead.deliveryLocation],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#6b6560;font-size:13px;width:40%;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e4dc;color:#1a1814;font-size:14px;font-weight:500;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1814;">
      <h1 style="font-size:20px;font-weight:500;margin:0 0 8px;">New Consultation Lead</h1>
      <p style="margin:0 0 20px;color:#6b6560;font-size:14px;">
        A white-glove sourcing request was submitted on the WCFG website.
      </p>
      <table style="width:100%;border-collapse:collapse;background:#faf8f5;border:1px solid #e8e4dc;">
        ${tableRows}
      </table>
      <p style="margin:20px 0 0;color:#6b6560;font-size:12px;">
        Reply to the client via WhatsApp or phone to begin the consultation.
      </p>
    </div>
  `;
}

function buildLeadEmailText(lead: ConsultationLeadInput): string {
  return [
    "New Consultation Lead",
    "",
    `Full Name: ${lead.fullName}`,
    `WhatsApp / Phone: ${lead.phone}`,
    `Desired Marque: ${lead.marque}`,
    `Budget Range: ${lead.budget}`,
    `Delivery Location: ${lead.deliveryLocation}`,
    "",
    "Reply to the client via WhatsApp or phone to begin the consultation.",
  ].join("\n");
}

/**
 * Sends a lead notification email. Failures are logged and never thrown —
 * the lead must remain saved even if email delivery fails.
 */
export async function notifyLeadEmail(
  lead: ConsultationLeadInput,
  leadId: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      "Lead notification skipped: RESEND_API_KEY is not configured.",
      { leadId }
    );
    return;
  }

  const to =
    process.env.LEADS_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY_EMAIL;
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send(
      {
        from,
        to: [to],
        subject: `New WCFG consultation: ${lead.fullName} · ${lead.marque}`,
        html: buildLeadEmailHtml(lead),
        text: buildLeadEmailText(lead),
      },
      { idempotencyKey: `consultation-lead/${leadId}` }
    );

    if (error) {
      console.error("Lead notification email failed:", error.message, {
        leadId,
        to,
      });
    }
  } catch (error) {
    console.error("Lead notification email threw:", error, { leadId, to });
  }
}
