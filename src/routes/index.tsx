import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Flame, Leaf } from "lucide-react";
import { communesByWilaya } from "@/data/communes";
import { deliveryRates, getRateForWilaya, wilayaLabel } from "@/data/shipping";

type Pack = { id: string; label: string; price: number; desc: string; featured?: boolean };
const packs: Pack[] = [
  { id: "mini", label: "علبة صغيرة", price: 2000, desc: "1 علبة صغيرة" },
  { id: "grande", label: "علبة كبيرة", price: 3400, desc: "1 علبة كبيرة", featured: true },
  { id: "duo", label: "علبتين كبيرتين", price: 6000, desc: "2 علبة كبيرة" },
];
type PackId = string;

const images = [
  "/1c6eaf9d-6f71-44ba-98c6-2bc94fa39eb3.jfif",
  "/a5a2f101-4cd1-432b-a47a-82fd598c99c7.jfif",
  "/a38543b2-d4e3-4c23-8383-f7f407375797.jfif",
  "/d42a2cc1-ec0c-4c45-961e-367b7bf54ad3.jfif",
];

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { property: "og:image", content: images[0] },
      { name: "twitter:image", content: images[0] },
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

// Wilayas are now sourced from shipping.ts (only covered zones)

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
              <span className="text-sm text-muted-foreground">ابتداءً من</span>
              <span className="text-2xl font-black text-primary sm:text-3xl">2000 DA</span>
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
  const [pack, setPack] = useState<PackId>("grande");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [deliveryType, setDeliveryType] = useState<"domicile" | "stopDesk">("domicile");

  const communes = useMemo(() => (wilaya ? communesByWilaya[wilaya] ?? [] : []), [wilaya]);
  const productPrice = packs.find((p) => p.id === pack)!.price;
  const rate = getRateForWilaya(wilaya);
  const deliveryFee = rate ? rate[deliveryType] : 0;
  const total = productPrice + deliveryFee;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Add extra calculated data to formData
    formData.append("pack", packs.find(p => p.id === pack)?.label || pack);
    formData.append("wilaya", wilaya);
    formData.append("commune", commune);
    formData.append("deliveryType", deliveryType === "domicile" ? "توصيل للمنزل" : "Stop Desk");
    formData.append("total", total.toString());
    formData.append("date", new Date().toISOString());

    try {
      const url = import.meta.env.VITE_GOOGLE_SHEET_URL;
      if (url && url !== "YOUR_WEB_APP_URL_HERE") {
        await fetch(url, { method: "POST", body: formData, mode: 'no-cors' });
      } else {
        console.warn("VITE_GOOGLE_SHEET_URL is missing or not configured yet.");
      }
      setSubmitted(true);
      form.reset();
      setWilaya("");
      setCommune("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form", error);
      alert("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order" className="mt-14 sm:mt-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="text-2xl font-black text-secondary sm:text-3xl md:text-4xl">
            أكمل <span className="gold-text">طلبك</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">اختر العرض المناسب وأكمل معلوماتك</p>
        </div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass shadow-luxury rounded-2xl p-4 sm:rounded-3xl sm:p-6 md:p-10"
        >
          {/* Pack selector */}
          <div className="mb-5 sm:mb-6">
            <label className="mb-3 block text-sm font-bold text-secondary">اختر العرض</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {packs.map((p) => {
                const active = pack === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPack(p.id)}
                    className={`relative rounded-2xl border-2 p-4 text-center transition ${
                      active
                        ? "border-primary bg-primary/10 shadow-gold"
                        : "border-input bg-white/60 hover:border-primary/50"
                    }`}
                  >
                    {p.featured && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-secondary">
                        الأكثر طلباً
                      </span>
                    )}
                    <div className="text-sm font-bold text-secondary">{p.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{p.desc}</div>
                    <div className="mt-2 text-lg font-black text-primary">{p.price} DA</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            <Field label="الاسم الكامل" name="name" required />
            <Field label="رقم الهاتف" name="phone" type="tel" required />
            <div>
              <label className="mb-2 block text-sm font-bold text-secondary">الولاية</label>
              <select
                required
                value={wilaya}
                onChange={(e) => { setWilaya(e.target.value); setCommune(""); }}
                className="w-full rounded-xl border border-input bg-white/70 px-4 py-3 text-secondary outline-none focus:border-primary sm:rounded-2xl"
              >
                <option value="">اختر الولاية</option>
                {deliveryRates.map((r) => (
                  <option key={r.wilaya} value={r.wilaya}>{wilayaLabel(r)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-secondary">البلدية</label>
              <select
                required
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                disabled={!wilaya}
                className="w-full rounded-xl border border-input bg-white/70 px-4 py-3 text-secondary outline-none focus:border-primary disabled:opacity-60 sm:rounded-2xl"
              >
                <option value="">{wilaya ? "اختر البلدية" : "اختر الولاية أولاً"}</option>
                {communes.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <Field label="العنوان" name="address" required />
            </div>

            {/* Delivery type */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-secondary">نوع التوصيل</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: "domicile", label: "توصيل للمنزل 🏠", sub: rate ? `${rate.domicile} DA` : "—" },
                  { key: "stopDesk", label: "Stop Desk 📦",    sub: rate ? `${rate.stopDesk} DA` : "—" },
                ] as const).map(({ key, label, sub }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDeliveryType(key)}
                    className={`rounded-2xl border-2 p-3 text-center transition ${
                      deliveryType === key
                        ? "border-primary bg-primary/10 shadow-gold"
                        : "border-input bg-white/60 hover:border-primary/50"
                    }`}
                  >
                    <div className="text-sm font-bold text-secondary">{label}</div>
                    <div className="mt-0.5 text-xs font-semibold text-primary">{sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Total breakdown */}
          <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>سعر المنتج</span>
              <span className="font-semibold text-secondary">{productPrice} DA</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>تكلفة التوصيل</span>
              <span className="font-semibold text-secondary">
                {wilaya ? `${deliveryFee} DA` : "اختر الولاية أولاً"}
              </span>
            </div>
            <div className="border-t border-primary/20 pt-2 flex items-center justify-between">
              <span className="font-bold text-secondary">المجموع الكلي</span>
              <span className="text-2xl font-black text-primary sm:text-3xl">{wilaya ? `${total} DA` : `${productPrice} DA`}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || submitted}
            className={`gold-gradient shadow-gold mt-5 w-full rounded-2xl py-3.5 text-base font-black text-secondary transition sm:mt-6 sm:py-4 sm:text-lg ${(isSubmitting || submitted) ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.01]"}`}
          >
            {isSubmitting ? "جاري الإرسال..." : submitted ? "تم استلام طلبك بنجاح ✓" : "تأكيد الطلب"}
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground sm:text-sm">
            الدفع عند الاستلام • توصيل عبر Swift Express 24/48H
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
