/**
 * Site-wide feature flags.
 *
 * Kept in one place so flipping a flag is a single-line change.
 * Flags here are deployed as part of the static SPA build — they
 * do NOT come from env vars or remote config, so changing them
 * requires a redeploy. That's intentional: predictable, auditable,
 * no surprise toggling behind the user's back.
 *
 * For server-enforced kill switches, see `worker/wrangler.toml` —
 * the Worker also rejects checkout when its own flag is set, so
 * even URL-typing past the SPA guard gets 503'd.
 */

/**
 * Lock the entire event-ticket purchase flow.
 * When true:
 *   - The "Ticket sichern" CTA on /events/:id renders disabled with
 *     "Bald verfügbar" — no link, no click target.
 *   - /event/buy/:eventId redirects back to the event detail page.
 *   - /event/ticket/resend renders a "Aktuell nicht buchbar" message.
 * Existing tickets (/event/ticket/:token) and the success page
 * continue to render — this flag does NOT invalidate anything that
 * was already issued.
 *
 * To unlock: set to `false`, commit, redeploy. Mirror the flip on
 * the Worker via `wrangler secret put BOOKING_LOCKED ""` (or the
 * matching wrangler.toml var) so both layers agree.
 */
export const BOOKING_LOCKED = true;
