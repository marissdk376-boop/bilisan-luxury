/**
 * Tarifs de livraison — SWIFT EXPRESS
 * Départ : TOUGGOURT | Livraison 24/48H
 */

export type DeliveryRate = {
  num: number;       // Official wilaya number
  wilaya: string;    // Arabic name
  domicile: number;  // DA — home delivery
  stopDesk: number;  // DA — stop desk / bureau
};

// Only wilayas covered by SWIFT EXPRESS (mapped to Arabic names used in the UI)
export const deliveryRates: DeliveryRate[] = [
  { num:  2, wilaya: "الشلف",           domicile: 950,  stopDesk: 550 },
  { num:  3, wilaya: "الأغواط",         domicile: 800,  stopDesk: 500 },
  { num:  4, wilaya: "أم البواقي",      domicile: 900,  stopDesk: 550 },
  { num:  5, wilaya: "باتنة",           domicile: 900,  stopDesk: 550 },
  { num:  6, wilaya: "بجاية",           domicile: 900,  stopDesk: 550 },
  { num:  7, wilaya: "بسكرة",           domicile: 1000, stopDesk: 600 },
  { num:  9, wilaya: "البليدة",         domicile: 950,  stopDesk: 550 },
  { num: 10, wilaya: "البويرة",         domicile: 950,  stopDesk: 550 },
  { num: 12, wilaya: "تبسة",            domicile: 1050, stopDesk: 600 },
  { num: 13, wilaya: "تلمسان",          domicile: 1000, stopDesk: 550 },
  { num: 14, wilaya: "تيارت",           domicile: 950,  stopDesk: 550 },
  { num: 15, wilaya: "تيزي وزو",        domicile: 950,  stopDesk: 550 },
  { num: 16, wilaya: "الجزائر",         domicile: 900,  stopDesk: 550 },
  { num: 17, wilaya: "الجلفة",          domicile: 800,  stopDesk: 500 },
  { num: 18, wilaya: "جيجل",            domicile: 950,  stopDesk: 550 },
  { num: 19, wilaya: "سطيف",            domicile: 950,  stopDesk: 550 },
  { num: 20, wilaya: "سعيدة",           domicile: 950,  stopDesk: 550 },
  { num: 21, wilaya: "سكيكدة",          domicile: 950,  stopDesk: 550 },
  { num: 22, wilaya: "سيدي بلعباس",     domicile: 950,  stopDesk: 550 },
  { num: 23, wilaya: "عنابة",           domicile: 950,  stopDesk: 550 },
  { num: 24, wilaya: "قالمة",           domicile: 950,  stopDesk: 650 },
  { num: 25, wilaya: "قسنطينة",         domicile: 950,  stopDesk: 550 },
  { num: 26, wilaya: "المدية",          domicile: 950,  stopDesk: 550 },
  { num: 27, wilaya: "مستغانم",         domicile: 950,  stopDesk: 550 },
  { num: 28, wilaya: "المسيلة",         domicile: 900,  stopDesk: 550 },
  { num: 29, wilaya: "معسكر",           domicile: 950,  stopDesk: 550 },
  { num: 30, wilaya: "ورقلة",           domicile: 800,  stopDesk: 500 },
  { num: 31, wilaya: "وهران",           domicile: 950,  stopDesk: 550 },
  { num: 32, wilaya: "البيض",           domicile: 1000, stopDesk: 750 },
  { num: 34, wilaya: "برج بوعريريج",    domicile: 950,  stopDesk: 550 },
  { num: 35, wilaya: "بومرداس",         domicile: 950,  stopDesk: 550 },
  { num: 36, wilaya: "الطارف",          domicile: 1050, stopDesk: 600 },
  { num: 39, wilaya: "الوادي",          domicile: 950,  stopDesk: 550 },
  { num: 40, wilaya: "خنشلة",           domicile: 1000, stopDesk: 600 },
  { num: 41, wilaya: "سوق أهراس",       domicile: 1000, stopDesk: 600 },
  { num: 42, wilaya: "تيبازة",          domicile: 950,  stopDesk: 550 },
  { num: 43, wilaya: "ميلة",            domicile: 950,  stopDesk: 550 },
  { num: 44, wilaya: "عين الدفلى",      domicile: 950,  stopDesk: 550 },
  { num: 45, wilaya: "النعامة",         domicile: 1000, stopDesk: 600 },
  { num: 46, wilaya: "عين تموشنت",      domicile: 950,  stopDesk: 650 },
  { num: 47, wilaya: "غرداية",          domicile: 800,  stopDesk: 500 },
  { num: 48, wilaya: "غليزان",          domicile: 950,  stopDesk: 550 },
  { num: 55, wilaya: "تقرت",            domicile: 600,  stopDesk: 450 },
];

/** Arabic wilaya names available for delivery */
export const availableWilayas = deliveryRates.map((r) => r.wilaya);

/** Formatted label for dropdown: "02 - الشلف" */
export function wilayaLabel(r: DeliveryRate): string {
  return `${String(r.num).padStart(2, "0")} - ${r.wilaya}`;
}

/** Get rates for a given wilaya name (Arabic). Returns undefined if not covered. */
export function getRateForWilaya(wilaya: string): DeliveryRate | undefined {
  return deliveryRates.find((r) => r.wilaya === wilaya);
}
