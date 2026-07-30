import { Check, Activity, Leaf, type LucideIcon } from "lucide-react";

export type Pack = {
  id: string;
  label: string;
  price: number;
  oldPrice?: number;
  desc: string;
  featured?: boolean;
  img?: string;
  freeDeliveryText?: string;
};

export type ProductFeature = {
  icon: LucideIcon;
  text: string;
};

export const productData = {
  // SEO & General Info
  name: "عشبة العلندة الخضراء",
  shortDescription: "عشبة طبيعية فعالة لعلاج العديد من الأمراض",
  brand: "الخضراء",
  category: "أعشاب طبيعية",
  
  // Media
  images: [
    "/WhatsApp Image 2026-07-30 at 14.16.08 (1).jpeg",
    "/WhatsApp Image 2026-07-30 at 14.16.08.jpeg",
    "/WhatsApp Image 2026-07-30 at 14.16.09.jpeg",
  ],
  backgroundPhoto: "/WhatsApp Image 2026-07-30 at 14.16.08.jpeg",

  // Pricing & Packs
  defaultPackId: "1kg",
  basePriceText: "1500 DA",
  packs: [
    { id: "1kg", label: "عشبة العلندة الخضراء 1 KG", price: 2500, oldPrice: 3000, desc: "عشبة العلندة الخضراء 1 KG", featured: true, img: "/WhatsApp Image 2026-07-30 at 14.16.08.jpeg", freeDeliveryText: "توصيل مجاني" },
    { id: "500g", label: "عشبة العلندة الخضراء 500 g", price: 1500, desc: "عشبة العلندة الخضراء 500 g", img: "/WhatsApp Image 2026-07-30 at 14.16.08.jpeg" },
  ] as Pack[],

  // UI Strings
  badge: "أصلي وطبيعي 100%",
  titlePart1: "عشبة",
  titleHighlight: "العلندة",
  titlePart2: "الخضراء",
  
  description: `يعالج اضطرابات الجهاز التنفسي: (يوسع القصبات الهوائية، يخفف السعال)
يعالج اضطرابات الجهاز الهضمي: (يساعد على الهضم، يطهر المعدة)
يعالج الأورام الخبيثة: (يدعم علاجات السرطان التقليدية)
يعالج الأمراض العصبية: (يهدئ الأعصاب، يحسن التركيز)
يعالج الأمراض الفيروسية: (يقوي المناعة ضد الفيروسات)
جديد: ينشط الدورة الدموية
جديد: يساعد في خفض الوزن (كمية للأيض)
جديد: مضاد للأكسدة قوي
جديد: يقلل الالتهابات المفصلية
جديد: يخفف من الصداع النصفي

طريقة الاستعمال:
في كأس ماء دافئ، وتشرب مرة واحدة في اليوم بعد فطور الصباح`,
  
  featuredBadgeText: "الأكثر طلباً",

  // Features List
  features: [
    { icon: Leaf, text: "عشبة طبيعية 100%" },
    { icon: Activity, text: "يقوي المناعة وينشط الدورة الدموية" },
    { icon: Check, text: "الدفع عند الاستلام في كل الولايات" },
  ] as ProductFeature[],
};
