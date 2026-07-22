/**
 * @file pixel.ts
 * @description Production-grade Meta Pixel utility.
 *
 * Architecture:
 * - Single source of truth for all fbq() calls.
 * - All functions are safe no-ops if fbq is unavailable or throws.
 * - Deduplication guard prevents double-firing in React StrictMode.
 * - DZD values are converted to EUR for tracking (Meta optimization).
 *   Displayed prices on the website are NOT affected.
 * - Advanced Matching: phone is normalized to E.164 format for Meta.
 * - event_id is generated per-Purchase for future CAPI deduplication.
 *
 * CAPI Extension:
 * - All exported types (FbqUserData, PurchaseParams, etc.) mirror the
 *   Meta Conversions API payload shape — add a CAPI call alongside
 *   fbq() in each track* function to enable server-side deduplication.
 */

// ─── Currency ────────────────────────────────────────────────────────────────

/**
 * DZD → EUR conversion for Meta tracking values only.
 * 1 EUR ≈ 145 DZD (update this constant as needed).
 * Meta's bidding algorithm is significantly better calibrated for EUR than DZD.
 */
const DZD_TO_EUR = 1 / 145;
const TRACKING_CURRENCY = "EUR";

/** Convert a DZD price to EUR, rounded to 2 decimal places. */
function toEur(dzd: number): number {
  return Math.round(dzd * DZD_TO_EUR * 100) / 100;
}

// ─── Types ────────────────────────────────────────────────────────────────────

/** Meta Pixel user data for Advanced Matching. */
export interface FbqUserData {
  /** Normalized phone in E.164 format, e.g. "+213XXXXXXXXX". */
  ph?: string;
  /** First name (lowercase, no accents). */
  fn?: string;
  /** Last name (lowercase, no accents). */
  ln?: string;
}

/** Standard ecommerce content object. */
export interface FbqContent {
  id: string;
  quantity: number;
  item_price: number;
}

/** Parameters for the ViewContent event. */
export interface ViewContentParams {
  contentName: string;
  contentCategory: string;
  contentIds: string[];
  value: number; // DZD
  numItems?: number;
}

/** Parameters for the InitiateCheckout event. */
export interface InitiateCheckoutParams {
  contentIds: string[];
  value: number; // DZD
  numItems: number;
}

/** Parameters for the Purchase event. */
export interface PurchaseParams {
  contentIds: string[];
  contentName: string;
  value: number; // DZD
  numItems: number;
  userData?: FbqUserData;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Guards against duplicate events (e.g. React StrictMode double-invoke). */
const _fired = new Set<string>();

/** Safely call fbq(). Never throws. */
function fbq(...args: unknown[]): void {
  try {
    if (typeof window === "undefined") return;
    const _fbq = (window as unknown as Record<string, unknown>).fbq;
    if (typeof _fbq !== "function") return;
    (_fbq as (...a: unknown[]) => void)(...args);
  } catch (e) {
    // Silently ignore any tracking failures — never crash the application.
    console.warn("[pixel] fbq() error (non-fatal):", e);
  }
}

/** Generate a unique event ID. Used for CAPI deduplication. */
function generateEventId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments.
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ─── Phone normalization ──────────────────────────────────────────────────────

/**
 * Normalize an Algerian phone number to E.164 format (+213XXXXXXXXX).
 * Meta requires digits only for the `ph` field — no +, spaces, or dashes.
 * Returns undefined if the number cannot be parsed.
 */
export function normalizeAlgerianPhone(raw: string): string | undefined {
  const digits = raw.replace(/\D/g, "");

  // Already full E.164 without + : 213XXXXXXXXX (12 digits)
  if (digits.startsWith("213") && digits.length === 12) {
    return digits;
  }
  // Local format: 0XXXXXXXXX (10 digits starting with 0)
  if (digits.startsWith("0") && digits.length === 10) {
    return `213${digits.slice(1)}`;
  }
  // 9-digit local without leading 0: XXXXXXXXX
  if (digits.length === 9) {
    return `213${digits}`;
  }
  return undefined;
}

/**
 * Parse a full Arabic/Latin name into first + last name parts.
 * Returns lowercase ASCII-safe strings for Meta Advanced Matching.
 */
export function parseName(fullName: string): { fn?: string; ln?: string } {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .map((p) => p.toLowerCase());
  if (parts.length === 0) return {};
  if (parts.length === 1) return { fn: parts[0] };
  const fn = parts[0];
  const ln = parts.slice(1).join(" ");
  return { fn, ln };
}

// ─── Pixel initialization ─────────────────────────────────────────────────────

/**
 * Initialize the Meta Pixel with Advanced Matching user data.
 * Safe to call multiple times — fbq() init has its own deduplication.
 * Call this once when user data becomes available (e.g. after form fill).
 */
export function initPixelWithUserData(userData: FbqUserData): void {
  try {
    fbq("init", "2104297943797519", userData);
  } catch (e) {
    console.warn("[pixel] init with user data failed (non-fatal):", e);
  }
}

// ─── Public tracking API ──────────────────────────────────────────────────────

/**
 * Track PageView.
 * Call once on initial client-side mount.
 * Deduplication guard prevents double-firing in React StrictMode.
 */
export function trackPageView(): void {
  if (_fired.has("PageView")) return;
  _fired.add("PageView");
  fbq("track", "PageView");
}

/**
 * Track ViewContent — fires when the product/landing page is visible.
 * Include full ecommerce metadata.
 */
export function trackViewContent(params: ViewContentParams): void {
  if (_fired.has("ViewContent")) return;
  _fired.add("ViewContent");

  fbq("track", "ViewContent", {
    content_name: params.contentName,
    content_category: params.contentCategory,
    content_ids: params.contentIds,
    content_type: "product",
    currency: TRACKING_CURRENCY,
    value: toEur(params.value),
    num_items: params.numItems ?? 1,
  });
}

/**
 * Track InitiateCheckout — fires when the user clicks the order CTA.
 * Must fire before the form validation/submission begins.
 */
export function trackInitiateCheckout(params: InitiateCheckoutParams): void {
  if (_fired.has("InitiateCheckout")) return;
  _fired.add("InitiateCheckout");

  fbq("track", "InitiateCheckout", {
    content_ids: params.contentIds,
    content_type: "product",
    currency: TRACKING_CURRENCY,
    value: toEur(params.value),
    num_items: params.numItems,
  });
}

/**
 * Track Purchase — ONLY call after the backend confirms the order.
 * Generates a unique event_id for future CAPI deduplication.
 * Re-initializes the Pixel with Advanced Matching user data if available.
 *
 * @returns The event_id generated — store it if you add CAPI later.
 */
export function trackPurchase(params: PurchaseParams): string {
  const eventId = generateEventId();

  // Re-init with user data to enable Advanced Matching on this event.
  if (params.userData && Object.keys(params.userData).length > 0) {
    initPixelWithUserData(params.userData);
  }

  fbq("track", "Purchase", {
    value: toEur(params.value),
    currency: TRACKING_CURRENCY,
    content_ids: params.contentIds,
    content_name: params.contentName,
    content_type: "product",
    num_items: params.numItems,
  }, { eventID: eventId });

  return eventId;
}

/**
 * Reset the deduplication guard for a specific event.
 * Use only in testing or when the user navigates to a new page context.
 */
export function resetPixelGuard(event: string): void {
  _fired.delete(event);
}

/**
 * Reset all deduplication guards.
 * Call on full SPA route change if your app has multiple routes.
 */
export function resetAllPixelGuards(): void {
  _fired.clear();
}
