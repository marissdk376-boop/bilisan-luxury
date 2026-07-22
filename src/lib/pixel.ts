/**
 * @file pixel.ts — Meta Pixel Production Library
 * @version 2.0.0
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ PUBLIC API                                                          │
 * │                                                                     │
 * │  identify(userData)        Store Advanced Matching data             │
 * │  reset()                   Clear user data + dedup guards           │
 * │                                                                     │
 * │  trackPageView()           Standard: page load                      │
 * │  trackViewContent(params)  Standard: product viewed                 │
 * │  trackCheckout(params)     Standard: InitiateCheckout               │
 * │  trackPurchase(params)     Standard: confirmed order                │
 * │  trackLead(params?)        Standard: lead captured                  │
 * │  trackContact()            Standard: contact initiated              │
 * │  trackCustom(name, data?)  Custom events via fbq('trackCustom')     │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ ENVIRONMENT VARIABLES (all optional)                                │
 * │                                                                     │
 * │  VITE_ENABLE_PIXEL=false        Disable all tracking               │
 * │  VITE_ENABLE_DEBUG=true         Force debug logs (auto-on in dev)  │
 * │  VITE_META_TEST_EVENT_CODE=...  Inject test_event_code             │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ CAPI EXTENSION POINT                                                │
 * │                                                                     │
 * │ trackPurchase() returns the generated event_id.                     │
 * │ Add your server-side fetch() call inside each track* function       │
 * │ to implement Conversions API with zero component refactoring.       │
 * └─────────────────────────────────────────────────────────────────────┘
 */

// ─── Pixel Config ────────────────────────────────────────────────────────────

const PIXEL_ID = "2104297943797519";

// ─── Environment & Feature Flags ─────────────────────────────────────────────

/** True in Vite development mode. */
const IS_DEV: boolean =
  typeof import.meta !== "undefined" && import.meta.env?.DEV === true;

/**
 * Master kill-switch. Set VITE_ENABLE_PIXEL=false to disable all tracking.
 * Defaults to enabled.
 */
const ENABLE_PIXEL: boolean =
  typeof import.meta !== "undefined"
    ? import.meta.env?.VITE_ENABLE_PIXEL !== "false"
    : true;

/**
 * Debug mode. Auto-enabled in development.
 * Force-enable in other envs via VITE_ENABLE_DEBUG=true.
 */
const ENABLE_DEBUG: boolean =
  IS_DEV ||
  (typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_ENABLE_DEBUG === "true");

/**
 * Meta Test Events code.
 * Set VITE_META_TEST_EVENT_CODE=TEST00000 to route events to Test Events tab.
 * Leave unset in production.
 */
const TEST_EVENT_CODE: string | undefined =
  typeof import.meta !== "undefined"
    ? (import.meta.env?.VITE_META_TEST_EVENT_CODE as string | undefined)
    : undefined;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Advanced Matching user data.
 * Keys follow Meta's hashed field naming (ph, fn, ln, em, etc.).
 * Meta hashes these server-side — do NOT pre-hash on the client.
 *
 * CAPI: These keys map 1-to-1 to the Conversions API user_data object.
 */
export interface FbqUserData {
  /** Phone in digits-only E.164 format, e.g. "213XXXXXXXXX" (no +). */
  ph?: string;
  /** First name, lowercase. */
  fn?: string;
  /** Last name, lowercase. */
  ln?: string;
  /** Email, lowercase. */
  em?: string;
}

/** Parameters for ViewContent. */
export interface ViewContentParams {
  contentName: string;
  contentCategory: string;
  contentIds: string[];
  /** Price in DZD. Sent to Meta as-is. */
  value: number;
  numItems?: number;
}

/** Parameters for InitiateCheckout. */
export interface CheckoutParams {
  contentIds: string[];
  /** Total in DZD (product + delivery). */
  value: number;
  numItems: number;
}

/** Parameters for Purchase. */
export interface PurchaseParams {
  contentIds: string[];
  contentName: string;
  /** Total in DZD (product + delivery). */
  value: number;
  numItems: number;
}

/** Parameters for Lead. */
export interface LeadParams {
  contentName?: string;
  currency?: string;
  value?: number;
}

// ─── Internal State ───────────────────────────────────────────────────────────

/** Stored Advanced Matching data. Set via identify(). */
let _userData: FbqUserData | null = null;

/** Deduplication guard. Prevents any event from firing more than once per session. */
const _fired = new Set<string>();

// ─── Logger ───────────────────────────────────────────────────────────────────

type LogType = "fired" | "duplicate" | "blocked" | "error" | "init";

const LOG_COLORS: Record<LogType, string> = {
  fired:     "color: #22c55e; font-weight: bold",   // green
  duplicate: "color: #f59e0b; font-weight: bold",   // amber
  blocked:   "color: #6b7280; font-weight: bold",   // gray
  error:     "color: #ef4444; font-weight: bold",   // red
  init:      "color: #3b82f6; font-weight: bold",   // blue
};

/**
 * Dev-only structured logger.
 * Prints nothing in production unless VITE_ENABLE_DEBUG=true.
 */
function log(type: LogType, event: string, data?: unknown): void {
  if (!ENABLE_DEBUG) return;
  const style = LOG_COLORS[type];
  const prefix = `%c[Meta Pixel] ${type.toUpperCase().padEnd(9)} ${event}`;
  if (data !== undefined) {
    console.log(prefix, style, data);
  } else {
    console.log(prefix, style);
  }
}

// ─── Core fbq() Wrapper ───────────────────────────────────────────────────────

/**
 * Safe wrapper around window.fbq().
 * - No-op if pixel is disabled (ENABLE_PIXEL=false).
 * - No-op during SSR (typeof window === 'undefined').
 * - No-op if fbq was blocked by an ad-blocker.
 * - Never throws — all errors are caught and warned.
 */
function fbq(command: string, event: string, data?: object, options?: object): void {
  if (!ENABLE_PIXEL) return;

  try {
    if (typeof window === "undefined") return;
    const _fbq = (window as unknown as Record<string, unknown>).fbq;
    if (typeof _fbq !== "function") {
      log("error", event, "fbq not found — pixel may be blocked");
      return;
    }

    // Build options: merge test_event_code if configured
    const finalOptions: Record<string, unknown> = { ...(options ?? {}) };
    if (TEST_EVENT_CODE) {
      finalOptions.test_event_code = TEST_EVENT_CODE;
    }

    const hasOptions = Object.keys(finalOptions).length > 0;

    if (data !== undefined && hasOptions) {
      (_fbq as Function)(command, event, data, finalOptions);
    } else if (data !== undefined) {
      (_fbq as Function)(command, event, data);
    } else {
      (_fbq as Function)(command, event);
    }
  } catch (err) {
    log("error", event, err);
    console.warn(`[Meta Pixel] fbq('${command}', '${event}') failed (non-fatal):`, err);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a unique event_id for CAPI deduplication. */
function generateEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Normalize an Algerian phone number to digits-only E.164.
 * Meta's `ph` field requires: digits only, no +, no spaces.
 * e.g. "0550 123 456" → "213550123456"
 */
export function normalizeAlgerianPhone(raw: string): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");

  if (digits.startsWith("213") && digits.length === 12) return digits;        // 213XXXXXXXXX
  if (digits.startsWith("0")   && digits.length === 10) return `213${digits.slice(1)}`; // 0XXXXXXXXX
  if (digits.length === 9)                              return `213${digits}`; // XXXXXXXXX
  return undefined;
}

/**
 * Parse a full name string into fn (first name) and ln (last name).
 * Meta requires lowercase strings for Advanced Matching.
 */
export function parseName(fullName: string): Pick<FbqUserData, "fn" | "ln"> {
  const parts = fullName.trim().split(/\s+/).filter(Boolean).map((p) => p.toLowerCase());
  if (parts.length === 0) return {};
  if (parts.length === 1) return { fn: parts[0] };
  return { fn: parts[0], ln: parts.slice(1).join(" ") };
}

// ─── Advanced Matching ────────────────────────────────────────────────────────

/**
 * Store Advanced Matching data for use in subsequent events (e.g. Purchase).
 * Does NOT call fbq() — data is attached at the event level.
 *
 * Call this as soon as user data is available (e.g. when form fields change).
 * CAPI: Pass the same userData object in your server-side CAPI call.
 */
export function identify(userData: FbqUserData): void {
  _userData = { ..._userData, ...userData };
  log("init", "identify", ENABLE_DEBUG ? _userData : "[redacted in prod]");
}

/**
 * Clear stored user data and reset all deduplication guards.
 * Call on logout or when a new session begins.
 */
export function reset(): void {
  _userData = null;
  _fired.clear();
  log("init", "reset — user data + dedup guards cleared");
}

// ─── Standard Events ──────────────────────────────────────────────────────────

/**
 * Track PageView.
 * Fire once on initial client-side mount via useEffect.
 * Deduplication guard is StrictMode-safe.
 */
export function trackPageView(): void {
  if (!ENABLE_PIXEL) {
    log("blocked", "PageView", "ENABLE_PIXEL=false");
    return;
  }
  if (_fired.has("PageView")) {
    log("duplicate", "PageView", "already fired this session");
    return;
  }
  _fired.add("PageView");
  fbq("track", "PageView");
  log("fired", "PageView");
}

/**
 * Track ViewContent.
 * Fire when the product page is visible to the user.
 *
 * @param params - Content metadata
 */
export function trackViewContent(params: ViewContentParams): void {
  if (!ENABLE_PIXEL) {
    log("blocked", "ViewContent", "ENABLE_PIXEL=false");
    return;
  }
  if (_fired.has("ViewContent")) {
    log("duplicate", "ViewContent", "already fired this session");
    return;
  }
  _fired.add("ViewContent");

  const payload = {
    content_name:     params.contentName,
    content_category: params.contentCategory,
    content_ids:      params.contentIds,
    content_type:     "product",
    currency:         "DZD",
    value:            Number(params.value), // explicit cast — always a number, never a string
    num_items:        params.numItems ?? 1,
  };

  fbq("track", "ViewContent", payload);
  log("fired", "ViewContent", payload);
}

/**
 * Track InitiateCheckout.
 * Fire when the user submits the order form (before the network call).
 * Deduplication ensures it only fires once even on retry attempts.
 *
 * @param params - Checkout metadata
 */
export function trackCheckout(params: CheckoutParams): void {
  if (!ENABLE_PIXEL) {
    log("blocked", "InitiateCheckout", "ENABLE_PIXEL=false");
    return;
  }
  if (_fired.has("InitiateCheckout")) {
    log("duplicate", "InitiateCheckout", "already fired this session");
    return;
  }
  _fired.add("InitiateCheckout");

  const payload = {
    content_ids:  params.contentIds,
    content_type: "product",
    currency:     "DZD",
    value:        Number(params.value),
    num_items:    params.numItems,
  };

  fbq("track", "InitiateCheckout", payload);
  log("fired", "InitiateCheckout", payload);
}

/**
 * Track Purchase.
 * ONLY call after the backend has confirmed the order was saved successfully.
 *
 * Advanced Matching is attached from the stored identify() data.
 * A unique event_id is generated for future CAPI deduplication.
 *
 * @param params - Purchase metadata
 * @returns event_id — store this if you add Conversions API later
 *
 * CAPI EXTENSION POINT:
 *   Add a fetch() to your server endpoint here, passing:
 *   - event_id (for deduplication with this pixel event)
 *   - _userData (for Advanced Matching server-side)
 *   - payload (event data)
 */
export function trackPurchase(params: PurchaseParams): string {
  const eventId = generateEventId();

  if (!ENABLE_PIXEL) {
    log("blocked", "Purchase", "ENABLE_PIXEL=false");
    return eventId;
  }
  if (_fired.has("Purchase")) {
    log("duplicate", "Purchase", "already fired this session — prevented double Purchase");
    return eventId;
  }
  _fired.add("Purchase");

  const payload = {
    value:        Number(params.value),
    currency:     "DZD",
    content_ids:  params.contentIds,
    content_name: params.contentName,
    content_type: "product",
    num_items:    params.numItems,
  };

  // Attach Advanced Matching from identify() data (stored in module scope).
  // This is passed as the options 4th argument alongside event_id.
  // Note: Meta's official Advanced Matching is set via fbq('init'), but
  // passing userData here provides matching context at the event level
  // and is the correct pattern when user data is only known at purchase time.
  const hasUserData = _userData && Object.keys(_userData).length > 0;

  fbq("track", "Purchase", payload, {
    eventID: eventId,
    ...(hasUserData ? { userData: _userData } : {}),
  });

  log("fired", "Purchase", {
    payload,
    eventId,
    userData: ENABLE_DEBUG ? _userData : "[redacted in prod]",
  });

  // CAPI EXTENSION:
  // fetch('/api/capi/purchase', {
  //   method: 'POST',
  //   body: JSON.stringify({ eventId, payload, userData: _userData }),
  // }).catch(console.warn);

  return eventId;
}

/**
 * Track Lead.
 * Fire when a user submits a contact/lead form.
 */
export function trackLead(params?: LeadParams): void {
  if (!ENABLE_PIXEL) {
    log("blocked", "Lead", "ENABLE_PIXEL=false");
    return;
  }
  if (_fired.has("Lead")) {
    log("duplicate", "Lead", "already fired this session");
    return;
  }
  _fired.add("Lead");

  const payload = params
    ? {
        ...(params.contentName ? { content_name: params.contentName } : {}),
        ...(params.currency    ? { currency:     params.currency }     : {}),
        ...(params.value !== undefined ? { value: Number(params.value) } : {}),
      }
    : undefined;

  fbq("track", "Lead", payload);
  log("fired", "Lead", payload);
}

/**
 * Track Contact.
 * Fire when a user initiates contact (e.g. clicks WhatsApp, phone button).
 */
export function trackContact(): void {
  if (!ENABLE_PIXEL) {
    log("blocked", "Contact", "ENABLE_PIXEL=false");
    return;
  }
  if (_fired.has("Contact")) {
    log("duplicate", "Contact", "already fired this session");
    return;
  }
  _fired.add("Contact");

  fbq("track", "Contact");
  log("fired", "Contact");
}

/**
 * Track a custom event.
 * Uses fbq('trackCustom', ...) — appears in Meta Events Manager under Custom Events.
 *
 * @param eventName - Your custom event name (e.g. "VideoPlayed", "MapClicked")
 * @param data      - Optional event parameters
 * @param dedupKey  - Optional deduplication key (defaults to eventName)
 */
export function trackCustom(
  eventName: string,
  data?: Record<string, unknown>,
  dedupKey?: string,
): void {
  if (!ENABLE_PIXEL) {
    log("blocked", `Custom:${eventName}`, "ENABLE_PIXEL=false");
    return;
  }

  const key = dedupKey ?? `Custom:${eventName}`;
  if (_fired.has(key)) {
    log("duplicate", `Custom:${eventName}`, "already fired this session");
    return;
  }
  _fired.add(key);

  fbq("trackCustom", eventName, data);
  log("fired", `Custom:${eventName}`, data);
}
