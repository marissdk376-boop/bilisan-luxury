import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Flame, Leaf } from "lucide-react";

import img1 from "@/assets/6b03e214-cf61-49ce-ad38-897931b75b96.jpg.asset.json";
import img2 from "@/assets/a5a2f101-4cd1-432b-a47a-82fd598c99c7.jpg.asset.json";
import img3 from "@/assets/a38543b2-d4e3-4c23-8383-f7f407375797.jpg.asset.json";
import img4 from "@/assets/1c6eaf9d-6f71-44ba-98c6-2bc94fa39eb3.jpg.asset.json";
import img5 from "@/assets/d42a2cc1-ec0c-4c45-961e-367b7bf54ad3.jpg.asset.json";

const images = [img1.url, img2.url, img3.url, img4.url, img5.url];

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { property: "og:image", content: img1.url },
      { name: "twitter:image", content: img1.url },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: "بخور البيلسان الأصلي",
        description: "بخور جزائري أصلي 100% طبيعي من الصحراء",
        image: images,
        brand: { "@type": "Brand", name: "بخور البيلسان" },
        offers: {
          "@type": "Offer",
          priceCurrency: "DZD",
          price: "3400",
          availability: "https://schema.org/InStock",
        },
      }),
    }],
  }),
});

const wilayas = [
  "أدرار","الشلف","الأغواط","أم البواقي","باتنة","بجاية","بسكرة","بشار","البليدة","البويرة",
  "تمنراست","تبسة","تلمسان","تيارت","تيزي وزو","الجزائر","الجلفة","جيجل","سطيف","سعيدة",
  "سكيكدة","سيدي بلعباس","عنابة","قالمة","قسنطينة","المدية","مستغانم","المسيلة","معسكر","ورقلة",
  "وهران","البيض","إليزي","برج بوعريريج","بومرداس","الطارف","تندوف","تيسمسيلت","الوادي","خنشلة",
  "سوق أهراس","تيبازة","ميلة","عين الدفلى","النعامة","عين تموشنت","غرداية","غليزان",
];

function Landing() {
  const [main, setMain] = useState(images[0]);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div>
            <motion.div
              key={main}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="glass shadow-luxury overflow-hidden rounded-2xl sm:rounded-3xl"
            >
              <img src={main} alt="بخور البيلسان الأصلي" className="aspect-square w-full object-cover" />
            </motion.div>
            <div className="mt-3 grid grid-cols-5 gap-2 sm:mt-4 sm:gap-3">
              {images.map((src) => (
                <button
                  key={src}
                  onClick={() => setMain(src)}
                  className={`overflow-hidden rounded-lg border-2 transition sm:rounded-xl ${main === src ? "border-primary shadow-gold" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Title + Description */}
          <div className="flex flex-col justify-center">
            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-bold text-secondary sm:mb-4 sm:px-4 sm:py-1.5 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              أصلي 100% من الصحراء الجزائرية
            </div>

            <h1 className="text-3xl font-black leading-tight text-secondary sm:text-4xl md:text-5xl lg:text-6xl">
              بخور <span className="gold-text">البيلسان</span> الأصلي
            </h1>

            <div className="mt-3 flex flex-wrap items-baseline gap-2 sm:mt-4 sm:gap-3">
              <span className="text-2xl font-black text-primary sm:text-3xl">3400 DA</span>
              <span className="text-base text-muted-foreground line-through sm:text-lg">4500 DA</span>
            </div>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
              بخور البيلسان الأصلي هو تحفة عطرية نادرة مستخرجة من أعماق الصحراء الجزائرية.
              رائحة شرقية فاخرة تدوم لساعات طويلة، تمنح منزلك أجواء الفخامة والأصالة،
              وتترك أثراً لا يُنسى في كل مناسبة. مكونات طبيعية 100% بدون أي إضافات كيميائية.
            </p>

            <ul className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
              {[
                { icon: Leaf, t: "طبيعي 100% بدون مواد كيميائية" },
                { icon: Flame, t: "رائحة تدوم لأكثر من 8 ساعات" },
                { icon: Check, t: "الدفع عند الاستلام في كل الولايات" },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-3 text-secondary">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary sm:h-9 sm:w-9">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium sm:text-base">{t}</span>
                </li>
              ))}
            </ul>

            <a
              href="#order"
              className="gold-gradient shadow-gold mt-6 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3.5 text-base font-black text-secondary transition hover:scale-[1.02] sm:mt-8 sm:px-8 sm:py-4 sm:text-lg md:w-fit"
            >
              اطلب الآن
            </a>
          </div>
        </div>

        {/* Order Form */}
        <OrderForm />
      </div>
    </main>
  );
}

function OrderForm() {
  const [submitted, setSubmitted] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };
  return (
    <section id="order" className="mt-14 sm:mt-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="text-2xl font-black text-secondary sm:text-3xl md:text-4xl">
            أكمل <span className="gold-text">طلبك</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">املأ النموذج وسنتواصل معك لتأكيد الطلب</p>
        </div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass shadow-luxury rounded-2xl p-4 sm:rounded-3xl sm:p-6 md:p-10"
        >
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            <Field label="الاسم الكامل" name="name" required />
            <Field label="رقم الهاتف" name="phone" type="tel" required />
            <div>
              <label className="mb-2 block text-sm font-bold text-secondary">الولاية</label>
              <select required className="w-full rounded-xl border border-input bg-white/70 px-4 py-3 text-secondary outline-none focus:border-primary sm:rounded-2xl">
                <option value="">اختر الولاية</option>
                {wilayas.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <Field label="البلدية" name="commune" required />
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-secondary">الكمية</label>
              <input type="number" name="qty" defaultValue={1} min={1} required className="w-full rounded-xl border border-input bg-white/70 px-4 py-3 text-secondary outline-none focus:border-primary sm:rounded-2xl" />
            </div>
          </div>

          <button
            type="submit"
            className="gold-gradient shadow-gold mt-6 w-full rounded-2xl py-3.5 text-base font-black text-secondary transition hover:scale-[1.01] sm:mt-8 sm:py-4 sm:text-lg"
          >
            {submitted ? "تم استلام طلبك ✓" : "تأكيد الطلب"}
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground sm:text-sm">
            الدفع عند الاستلام • توصيل لكل الولايات
          </p>
        </motion.form>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-secondary">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-input bg-white/70 px-4 py-3 text-secondary outline-none focus:border-primary sm:rounded-2xl"
      />
    </div>
  );
}
