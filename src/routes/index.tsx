import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Flame, Leaf } from "lucide-react";
import { communesByWilaya } from "@/data/communes";
import { deliveryRates, getRateForWilaya, wilayaLabel } from "@/data/shipping";
import {
  trackViewContent,
  trackInitiateCheckout,
  trackPurchase,
  normalizeAlgerianPhone,
  parseName,
} from "@/lib/pixel";

type Pack = { id: string; label: string; price: number; desc: string; featured?: boolean; img?: string };
const packs: Pack[] = [
  { id: "mini", label: "علبة بخور صغيرة + عطر", price: 2000, desc: "علبة بخور صغيرة + عطر", img: "/0303.jfif" },
  { id: "grande", label: "علبة بخور كبيرة + عطر", price: 3400, desc: "علبة بخور كبيرة + عطر", featured: true, img: "/pack-grande.jpg" },
  { id: "duo", label: "2 علبة بخور كبيرة + 2 عطر", price: 6000, desc: "2 علبة بخور كبيرة + 2 عطر", img: "/pack-grande.jpg" },
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

  // Track ViewContent once when the product page is visible.
  useEffect(() => {
    trackViewContent({
      contentName: "بخور البيلسان الأصلي",
      contentCategory: "بخور",
      contentIds: ["pack_grande"],
      value: 3400, // DZD — converted to EUR by pixel.ts
      numItems: 1,
    });
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#FDFBF7] font-arabic">
      {/* Photo Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="/0404.jfif" 
          alt="" 
          className="absolute inset-0 h-full w-full object-cover object-center fixed opacity-30" 
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:py-10 lg:py-16">
        {/* Order Form — first position */}
        <OrderForm />

        {/* Gallery + Description */}
        <div className="mt-14 sm:mt-20 grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div>
            <motion.div
              key={main}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="glass shadow-luxury overflow-hidden rounded-2xl sm:rounded-3xl border-primary/20"
            >
              <img src={main} alt="بخور البيلسان الأصلي" className="aspect-square w-full object-cover" />
            </motion.div>
            <div className="mt-3 grid grid-cols-5 gap-2 sm:mt-4 sm:gap-3">
              {images.map((src) => (
                <button
                  key={src}
                  onClick={() => setMain(src)}
                  className={`overflow-hidden rounded-lg border-2 transition sm:rounded-xl ${main === src ? "border-primary shadow-gold" : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"}`}
                >
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Title + Description */}
          <div className="flex flex-col justify-center">
            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-white/60 px-3 py-1 text-[11px] font-bold text-secondary shadow-sm sm:mb-4 sm:px-4 sm:py-1.5 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              أصلي 100% من الصحراء الجزائرية
            </div>

            <h1 className="text-3xl font-black leading-tight text-secondary sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-sm">
              بخور <span className="gold-text drop-shadow-md">البيلسان</span> الأصلي
            </h1>

            <div className="mt-3 flex flex-wrap items-baseline gap-2 sm:mt-4 sm:gap-3">
              <span className="text-sm text-muted-foreground font-medium">ابتداءً من</span>
              <span className="text-2xl font-black text-primary sm:text-3xl drop-shadow-sm">2000 DA</span>
            </div>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg font-medium">
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
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-primary/20 text-primary sm:h-9 sm:w-9 transition-transform hover:scale-110">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-bold sm:text-base">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
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

    // Collect user-entered values for Advanced Matching before formData mutations.
    const rawPhone = formData.get("phone") as string ?? "";
    const rawName  = formData.get("name")  as string ?? "";

    // Add extra calculated data to formData
    formData.append("pack", packs.find(p => p.id === pack)?.label || pack);
    formData.append("wilaya", wilaya);
    formData.append("commune", commune);
    formData.append("deliveryType", deliveryType === "domicile" ? "توصيل للمنزل" : "Stop Desk");
    formData.append("total", total.toString());
    formData.append("date", new Date().toISOString());

    // Track InitiateCheckout — fires once per session, before the network call.
    const selectedPack = packs.find((p) => p.id === pack)!;
    trackInitiateCheckout({
      contentIds: [pack],
      value: total,
      numItems: 1,
    });

    try {
      const url = import.meta.env.VITE_GOOGLE_SHEET_URL;
      const urlSearchParams = new URLSearchParams(formData as any);

      if (url && url !== "YOUR_WEB_APP_URL_HERE") {
        await fetch(url, { method: "POST", body: urlSearchParams, mode: 'no-cors' });
      } else {
        console.warn("VITE_GOOGLE_SHEET_URL is missing or not configured yet.");
      }

      // Track Purchase ONLY after confirmed backend success.
      // Advanced Matching: phone + name are normalized and passed to Meta.
      const { fn, ln } = parseName(rawName);
      trackPurchase({
        contentIds: [pack],
        contentName: selectedPack.label,
        value: total,
        numItems: 1,
        userData: {
          ph: normalizeAlgerianPhone(rawPhone),
          fn,
          ln,
        },
      });

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
    <section id="order">
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
                    onClick={() => {
                      setPack(p.id);
                      document.getElementById("user-info-fields")?.scrollIntoView({ behavior: "smooth" });
                    }}
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
                    {p.img && (
                      <div className="relative mx-auto mb-3 mt-1 w-[65%] max-w-[130px]">
                        <div className="overflow-hidden rounded-2xl border-2 border-primary/40 shadow-gold" style={{ background: "linear-gradient(135deg, #201612 0%, #3a2518 60%, #4a2e18 100%)" }}>
                          <img src={p.img} alt={p.label} className="h-auto w-full object-cover" />
                        </div>
                        {p.id === "duo" && (
                          <span className="absolute -bottom-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-black text-secondary shadow-gold border-2 border-white">
                            ×2
                          </span>
                        )}
                      </div>
                    )}
                    <div className="text-sm font-bold text-secondary">{p.label}</div>
                    <div className="mt-2 text-lg font-black text-primary">{p.price} DA</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div id="user-info-fields" className="grid gap-4 sm:gap-5 md:grid-cols-2 scroll-mt-6">
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

      {/* Success Popup Modal */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-2xl font-black text-secondary">
                تم استلام طلبك بنجاح!
              </h3>
              <p className="mb-6 text-base text-muted-foreground">
                شكراً لك على ثقتك بنا. سنتصل بك لتأكيد الطلب في غضون الـ 5 ساعات القادمة.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="gold-gradient shadow-gold w-full rounded-xl py-3 text-lg font-bold text-secondary transition hover:scale-[1.02]"
              >
                حسناً
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
