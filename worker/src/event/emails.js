/* ═══════════════════════════════════════════════════════════════════
   Event ticket emails — RITMO-Bauhaus templates (DE).
   ───────────────────────────────────────────────────────────────────
   Phase 3 ships the confirmation template only. Resend, refund, and
   transfer templates land in Phases 5-6.

   Style: hosted in the `ritmoShell` from utils/resend.js — same look as
   the rest of the site (orange accent, sharp corners, geometric).
   ═══════════════════════════════════════════════════════════════════ */

import { ritmoShell, escapeHtml } from '../utils/resend.js';

const SPIELSTIL_DISPLAY = {
  chico:       { name: 'CHICO',       subtitle: 'Der Stratege' },
  toro:        { name: 'TORO',        subtitle: 'Die Kraft' },
  individuoso: { name: 'INDIVIDUOSO', subtitle: 'Der Künstler' },
  muro:        { name: 'MURO',        subtitle: 'Die Mauer' },
  fantasma:    { name: 'FANTASMA',    subtitle: 'Der Phantom-Spieler' },
  motor:       { name: 'MOTOR',       subtitle: 'Die Maschine' },
  hysterica:   { name: 'HYSTERICA',   subtitle: 'Die Dramatikerin' },
};

/**
 * Build the confirmation email.
 *
 * @param {object} args
 * @param {string} args.eventName
 * @param {string} args.eventDateLong       e.g. "Samstag, 18. Juli 2026 · ab 18 Uhr"
 * @param {string} args.venueLine           e.g. "Padel Haus · Großmehring"
 * @param {string} args.buyerFirstName
 * @param {'spieler'|'zuschauer'} args.tier
 * @param {string} args.ticketBaseUrl       e.g. "https://ritmopadel.shop/event/ticket"
 * @param {Array<{ attendeeName: string, ticketToken: string, spielstilId?: string }>} args.tickets
 * @param {string[]} args.tierExtras        Items included with this tier
 * @param {string} args.refundLink          Signed magic link to /event/ticket/refund/...
 * @param {number} args.totalEur            Final amount paid (display only)
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildConfirmationEmail(args) {
  const {
    eventName, eventDateLong, venueLine, buyerFirstName, tier,
    ticketBaseUrl, tickets, tierExtras, refundLink, totalEur,
  } = args;

  const isSpieler = tier === 'spieler';
  const subject = `Dein Ticket: ${eventName}`;
  const preheader =
    `${tickets.length}× Ticket bestätigt — bitte den Link öffnen und das Ticket speichern oder ausdrucken.`;

  const ticketsHtml = tickets.map((t, i) => {
    const url = `${ticketBaseUrl}/${t.ticketToken}`;
    const spielstil = isSpieler && t.spielstilId ? SPIELSTIL_DISPLAY[t.spielstilId] : null;
    return `
      <div class="tile">
        <small>Ticket ${i + 1} von ${tickets.length}</small>
        <h3>${escapeHtml(t.attendeeName)}</h3>
        ${spielstil ? `<p style="margin:0 0 14px;color:#FF7A1A;font-size:13px;letter-spacing:.08em;">
          SPIELSTIL · ${escapeHtml(spielstil.name)} · <span style="color:#aaa">${escapeHtml(spielstil.subtitle)}</span>
        </p>` : ''}
        <a href="${url}" class="btn">Ticket öffnen →</a>
        <p style="margin:14px 0 0;font-size:12px;color:#888;">
          ${escapeHtml(url)}
        </p>
      </div>`;
  }).join('');

  const extrasHtml = tierExtras?.length
    ? `<ul style="padding-left:18px;margin:8px 0 0;color:#bbb;font-size:14px;">
        ${tierExtras.map((e) => `<li style="margin:4px 0;">${escapeHtml(e)}</li>`).join('')}
       </ul>`
    : '';

  const body = `
    <h1 style="font-size:24px;margin:0 0 12px;">Hi ${escapeHtml(buyerFirstName)},</h1>
    <p>danke für deine Bestellung. ${tickets.length === 1 ? 'Dein Ticket' : `Deine ${tickets.length} Tickets`}
    ${tickets.length === 1 ? 'ist' : 'sind'} reserviert — wir freuen uns auf dich.</p>

    <div class="tile">
      <small>Event</small>
      <h3 style="margin-bottom:4px;">${escapeHtml(eventName)}</h3>
      <p style="margin:0;color:#bbb;">${escapeHtml(eventDateLong)}</p>
      <p style="margin:6px 0 0;color:#bbb;">${escapeHtml(venueLine)}</p>
    </div>

    <h2 style="font-size:18px;margin:28px 0 8px;">Dein${tickets.length === 1 ? '' : 'e'} Ticket${tickets.length === 1 ? '' : 's'}</h2>
    <p style="color:#bbb;font-size:13px;margin:0 0 6px;">
      Bitte öffne ${tickets.length === 1 ? 'das Ticket' : 'jedes Ticket'} im Browser und
      <strong>mache einen Screenshot oder drucke es aus</strong> — der QR-Code wird am
      Eingang gescannt. Bei mehreren Tickets: jede Person bekommt einen eigenen Link.
    </p>
    ${ticketsHtml}

    <h2 style="font-size:18px;margin:28px 0 8px;">Inklusive</h2>
    ${extrasHtml}

    <h2 style="font-size:18px;margin:28px 0 8px;">Bezahlt</h2>
    <p style="margin:0;color:#bbb;">${totalEur.toFixed(2).replace('.', ',')} EUR — gezahlt via Stripe.
    Die Quittung kommt direkt von Stripe.</p>

    <h2 style="font-size:18px;margin:28px 0 8px;">Stornieren</h2>
    <p style="margin:0 0 8px;color:#bbb;">
      Bis 7 Tage vor dem Event kannst du selbst stornieren — der Betrag wird automatisch
      auf deine Karte zurückerstattet.
    </p>
    <p style="margin:0;">
      <a href="${refundLink}" style="color:#FF7A1A;">Ticket${tickets.length === 1 ? '' : 's'} stornieren →</a>
    </p>

    <p style="margin:32px 0 0;color:#888;font-size:12px;">
      Bei Fragen einfach auf diese Email antworten.
    </p>`;

  const html = ritmoShell({ preheader, bodyHtml: body });

  const text = [
    `Hi ${buyerFirstName},`,
    ``,
    `Dein${tickets.length === 1 ? '' : 'e'} Ticket${tickets.length === 1 ? '' : 's'} für ${eventName} ist bestätigt.`,
    `${eventDateLong}`,
    `${venueLine}`,
    ``,
    ...tickets.map((t, i) => {
      const url = `${ticketBaseUrl}/${t.ticketToken}`;
      const spielstilLine = isSpieler && t.spielstilId
        ? `Spielstil: ${SPIELSTIL_DISPLAY[t.spielstilId]?.name || t.spielstilId.toUpperCase()}`
        : '';
      return [
        `Ticket ${i + 1} von ${tickets.length}: ${t.attendeeName}`,
        spielstilLine,
        url,
      ].filter(Boolean).join('\n');
    }),
    ``,
    `Bitte öffne jedes Ticket im Browser und mache einen Screenshot oder drucke es aus.`,
    `Der QR-Code wird am Eingang gescannt.`,
    ``,
    `Inklusive: ${(tierExtras || []).join(' · ')}`,
    `Bezahlt: ${totalEur.toFixed(2).replace('.', ',')} EUR (Stripe)`,
    ``,
    `Stornieren bis 7 Tage vor Event möglich:`,
    refundLink,
    ``,
    `Bei Fragen: hello@ritmopadel.shop`,
  ].filter((l) => l !== undefined).join('\n');

  return { subject, html, text };
}
