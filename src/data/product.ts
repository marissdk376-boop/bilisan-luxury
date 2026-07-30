import { Check, Activity, Leaf, type LucideIcon } from "lucide-react";

export type Pack = {
  id: string;
  label: string;
  price: number;
  desc: string;
  featured?: boolean;
  img?: string;
};

export type ProductFeature = {
  icon: LucideIcon;
  text: string;
};

export const productData = {
  // SEO & General Info
  name: "عشبة العلندة الحكيم",
  shortDescription: "عشبة طبيعية فعالة لعلاج العديد من الأمراض",
  brand: "الحكيم",
  category: "أعشاب طبيعية",
  
  // Media
  images: [
    "/1c6eaf9d-6f71-44ba-98c6-2bc94fa39eb3.jfif",
    "/a5a2f101-4cd1-432b-a47a-82fd598c99c7.jfif",
    "/a38543b2-d4e3-4c23-8383-f7f407375797.jfif",
    "/d42a2cc1-ec0c-4c45-961e-367b7bf54ad3.jfif",
  ],
  backgroundPhoto: "/0404.jfif",

  // Pricing & Packs
  defaultPackId: "1kg",
  basePriceText: "1500 DA",
  packs: [
    { id: "1kg", label: "عشبة العلندة الحكيم 1 KG", price: 2500, desc: "عشبة العلندة الحكيم 1 KG", featured: true, img: "/WhatsApp Image 2026-07-30 at 14.16.08.jpeg" },
    { id: "500g", label: "عشبة العلندة الحكيم 500 g", price: 1500, desc: "عشبة العلندة الحكيم 500 g", img: "/WhatsApp Image 2026-07-30 at 14.16.08.jpeg" },
  ] as Pack[],

  // UI Strings
  badge: "أصلي وطبيعي 100%",
  titlePart1: "عشبة",
  titleHighlight: "العلندة",
  titlePart2: "الحكيم",
  
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
