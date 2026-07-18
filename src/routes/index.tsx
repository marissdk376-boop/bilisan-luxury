import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Menu, X, Star, Check, ChevronDown, ArrowUp, MessageCircle, ShoppingBag,
  Sparkles, Home, Clock, Flag, Award, Gift, Leaf, Flame, Plus, Minus, ZoomIn,
} from "lucide-react";

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
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          reviewCount: "127",
        },
      }),
    }],
  }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-secondary"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto h-16 w-16 rounded-full border-2 border-transparent border-t-primary border-l-primary"
        />
        <div className="mt-6 gold-text font-arabic-display text-2xl">بخور البيلسان</div>
      </div>
    </motion.div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#home", label: "الرئيسية" },
    { href: "#features", label: "المميزات" },
    { href: "#gallery", label: "الصور" },
    { href: "#pricing", label: "الأسعار" },
    { href: "#faq", label: "الأسئلة" },
    { href: "#order", label: "اطلب الآن" },
  ];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/90 backdrop-blur-xl shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <a href="#home" className="flex items-center gap-2">
          <div className="gold-gradient grid h-10 w-10 place-items-center rounded-full shadow-gold">
            <Sparkles className="h-5 w-5 text-secondary" />
          </div>
          <span className={`font-arabic-display text-xl font-bold ${scrolled ? "text-secondary" : "text-secondary"}`}>
            البيلسان
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`relative text-sm font-semibold transition-colors hover:text-[color:var(--gold-dark)] ${
                scrolled ? "text-secondary" : "text-secondary"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#order"
          className="hidden gold-gradient rounded-full px-6 py-2.5 text-sm font-bold text-secondary shadow-gold transition-transform hover:scale-105 lg:inline-block"
        >
          اطلب الآن
        </a>

        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-secondary hover:bg-primary/10"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section ref={ref} id="home" className="relative min-h-screen overflow-hidden pt-24 lg:pt-32">
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-40 bottom-20 h-96 w-96 rounded-full bg-[color:var(--gold-light)]/30 blur-3xl" />
      </motion.div>

      {/* Ornament */}
      <svg className="absolute right-4 top-28 hidden h-32 w-32 opacity-30 lg:block" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="35" stroke="#D4AF37" strokeWidth="0.5" />
        <path d="M50 5 L50 95 M5 50 L95 50 M15 15 L85 85 M85 15 L15 85" stroke="#D4AF37" strokeWidth="0.3" />
      </svg>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 lg:grid-cols-2 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center lg:text-right">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-semibold text-[color:var(--gold-dark)]">
            <Sparkles className="h-4 w-4" />
            منتج جزائري أصلي 100٪
          </div>
          <h1 className="font-arabic-display text-5xl font-bold leading-tight text-secondary md:text-6xl lg:text-7xl">
            بخور <span className="gold-text">البيلسان</span> الأصلي
          </h1>
          <p className="mt-4 text-xl font-semibold text-[color:var(--gold-dark)] md:text-2xl">
            من أعماق الصحراء الجزائرية
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            استمتعي برائحة البخور الأصلي التي تدوم لساعات طويلة وتمنح منزلك لمسة من الفخامة والأصالة.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
            <motion.a
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              href="#order"
              className="gold-gradient inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold text-secondary shadow-gold"
            >
              <ShoppingBag className="h-5 w-5" />
              اطلب الآن
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              href="#gallery"
              className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-transparent px-8 py-4 font-bold text-secondary transition-colors hover:bg-secondary hover:text-white"
            >
              شاهد الصور
            </motion.a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 lg:justify-start">
            {[
              { icon: Check, t: "توصيل لكل الولايات" },
              { icon: Star, t: "تقييم 5 نجوم" },
              { icon: Award, t: "جودة مضمونة" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <f.icon className="h-4 w-4 text-[color:var(--gold-dark)]" />
                {f.t}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative mx-auto aspect-square w-full max-w-lg"
        >
          {/* Smoke */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-smoke absolute left-1/2 top-1/3 h-24 w-24 -translate-x-1/2 rounded-full bg-white/40 blur-2xl"
              style={{ animationDelay: `${i * 1.2}s` }}
            />
          ))}
          {/* Glow */}
          <div className="absolute inset-8 gold-gradient rounded-full opacity-40 blur-3xl" />
          {/* Product */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <div className="glass shadow-luxury absolute inset-0 rounded-[3rem] overflow-hidden">
              <img src={img1.url} alt="بخور البيلسان الأصلي" className="h-full w-full object-cover" loading="eager" />
            </div>
            <div className="absolute -bottom-4 -right-4 gold-gradient shadow-gold flex items-center gap-2 rounded-full px-5 py-3 font-bold text-secondary">
              <Flame className="h-5 w-5" /> الأكثر مبيعاً
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: "🌿", title: "100٪ طبيعي", desc: "مكونات طبيعية خالصة" },
    { icon: "🏡", title: "يعطر المنزل بالكامل", desc: "رائحة تنتشر في كل زوايا البيت" },
    { icon: "⏳", title: "رائحة تدوم لساعات", desc: "عطر يبقى طويلاً" },
    { icon: "🇩🇿", title: "منتج جزائري أصلي", desc: "من قلب الصحراء" },
    { icon: "✨", title: "جودة عالية", desc: "أفضل معايير الجودة" },
    { icon: "🎁", title: "هدية مثالية", desc: "لأحبائك في كل المناسبات" },
  ];
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading kicker="لماذا نحن" title="أسرار فخامة البيلسان" />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ scale: 1.03, y: -6 }}
              className="glass shadow-luxury group rounded-3xl p-8 text-center"
            >
              <div className="mx-auto mb-4 text-6xl transition-transform duration-500 group-hover:scale-110">{it.icon}</div>
              <h3 className="text-xl font-bold text-secondary">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-luxury"
        >
          <img src={img2.url} alt="عن المنتج" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 to-transparent" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-4 text-sm font-bold uppercase tracking-widest text-[color:var(--gold-dark)]">عن المنتج</div>
          <h2 className="font-arabic-display text-4xl font-bold text-secondary md:text-5xl">
            فخامة <span className="gold-text">شرقية</span> من قلب الصحراء
          </h2>
          <p className="mt-6 text-lg leading-loose text-muted-foreground">
            بخور البيلسان الأصلي مستخرج من أجود المكونات الطبيعية القادمة من أعماق الصحراء الجزائرية،
            يمنح منزلك عطراً شرقياً فاخراً يدوم طويلاً ويخلق أجواءً من الراحة والفخامة.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { n: "100٪", l: "طبيعي" },
              { n: "+8", l: "ساعات ثبات" },
              { n: "1000+", l: "عميل سعيد" },
              { n: "5.0", l: "متوسط التقييم" },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl p-4 text-center">
                <div className="gold-text font-arabic-display text-3xl font-bold">{s.n}</div>
                <div className="text-sm text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Pricing() {
  const scrollTo = () => document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading kicker="الأسعار" title="اختر عرضك المفضل" />
        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:items-center">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass shadow-luxury rounded-3xl p-8 text-center"
          >
            <h3 className="font-arabic-display text-2xl font-bold text-secondary">العلبة الكبيرة</h3>
            <div className="mt-6 text-sm text-muted-foreground line-through">4000 DA</div>
            <div className="gold-text font-arabic-display text-5xl font-bold">3400 DA</div>
            <div className="mx-auto mt-3 inline-block rounded-full bg-destructive px-3 py-1 text-xs font-bold text-white">
              وفر 600 DA
            </div>
            <ul className="mt-8 space-y-3 text-right">
              {["كمية أكبر", "أفضل قيمة", "شحن سريع"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-success" /> {f}
                </li>
              ))}
            </ul>
            <button onClick={scrollTo} className="gold-gradient mt-8 w-full rounded-full py-3 font-bold text-secondary shadow-gold transition-transform hover:scale-105">
              اطلب الآن
            </button>
          </motion.div>

          {/* Card 3 - Featured (middle for prominence) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="gold-gradient shadow-luxury relative rounded-[2rem] p-10 text-center lg:scale-110"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-5 py-2 text-xs font-bold text-primary">
              🔥 عرض خاص — أفضل عرض
            </div>
            <h3 className="font-arabic-display mt-4 text-3xl font-bold text-secondary">علبتين كبيرتين</h3>
            <div className="mt-6 text-base text-secondary/70 line-through">8000 DA</div>
            <div className="font-arabic-display text-6xl font-bold text-secondary">6000 DA</div>
            <div className="mx-auto mt-3 inline-block rounded-full bg-destructive px-4 py-1.5 text-sm font-bold text-white">
              وفر 2000 DA
            </div>
            <ul className="mt-8 space-y-3 text-right text-secondary">
              {["علبتين بسعر واحد", "توفير كبير", "الأفضل للعائلة", "هدية مجانية"].map((f) => (
                <li key={f} className="flex items-center gap-2 font-semibold">
                  <Check className="h-5 w-5" /> {f}
                </li>
              ))}
            </ul>
            <button onClick={scrollTo} className="mt-8 w-full rounded-full bg-secondary py-4 text-lg font-bold text-primary transition-transform hover:scale-105">
              احصل على العرض
            </button>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass shadow-luxury rounded-3xl p-8 text-center"
          >
            <h3 className="font-arabic-display text-2xl font-bold text-secondary">العلبة الصغيرة</h3>
            <div className="mt-6 text-sm text-transparent">-</div>
            <div className="gold-text font-arabic-display text-5xl font-bold">2000 DA</div>
            <div className="mt-3 text-xs text-muted-foreground">مثالية للتجربة</div>
            <ul className="mt-8 space-y-3 text-right">
              {["حجم مناسب", "سعر اقتصادي", "جودة عالية"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-success" /> {f}
                </li>
              ))}
            </ul>
            <button onClick={scrollTo} className="gold-gradient mt-8 w-full rounded-full py-3 font-bold text-secondary shadow-gold transition-transform hover:scale-105">
              اطلب الآن
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const layout = [
    { src: images[0], span: "md:col-span-2 md:row-span-2" },
    { src: images[1], span: "" },
    { src: images[2], span: "" },
    { src: images[3], span: "md:col-span-2" },
    { src: images[4], span: "" },
  ];
  return (
    <section id="gallery" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading kicker="المعرض" title="لحظات من الفخامة" />
        <div className="mt-16 grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-4">
          {layout.map((it, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => setLightbox(it.src)}
              className={`group relative overflow-hidden rounded-3xl shadow-luxury ${it.span}`}
            >
              <img src={it.src} alt="بخور البيلسان" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <ZoomIn className="absolute bottom-4 left-4 h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4"
          >
            <motion.img
              initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              src={lightbox} alt="preview"
              className="max-h-[90vh] max-w-full rounded-3xl object-contain"
            />
            <button onClick={() => setLightbox(null)} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur">
              <X className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function HowToUse() {
  const steps = [
    { n: "1", t: "ضع كمية صغيرة داخل المبخرة", icon: Gift },
    { n: "2", t: "أشعل الفحم أو المبخرة الكهربائية", icon: Flame },
    { n: "3", t: "استمتع برائحة تدوم لساعات طويلة", icon: Sparkles },
  ];
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <SectionHeading kicker="طريقة الاستخدام" title="بثلاث خطوات بسيطة" />
        <div className="relative mt-16">
          <div className="absolute right-1/2 top-0 hidden h-full w-px translate-x-1/2 gold-gradient md:block" />
          <div className="space-y-12">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col items-center gap-6 md:flex-row ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="glass shadow-luxury flex-1 rounded-3xl p-8">
                  <s.icon className="mb-4 h-10 w-10 text-[color:var(--gold-dark)]" />
                  <p className="text-xl font-semibold text-secondary">{s.t}</p>
                </div>
                <div className="gold-gradient shadow-gold z-10 grid h-20 w-20 shrink-0 place-items-center rounded-full font-arabic-display text-3xl font-bold text-secondary">
                  {s.n}
                </div>
                <div className="hidden flex-1 md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { name: "أم يوسف", city: "الجزائر", text: "الرائحة رائعة وتدوم لساعات، أنصح به بشدة." },
    { name: "فاطمة", city: "وهران", text: "أفضل بخور اشتريته، جودة ممتازة وسعر مناسب." },
    { name: "خديجة", city: "قسنطينة", text: "الكل يسألني عن مصدر هذه الرائحة، منتج مميز." },
  ];
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading kicker="آراء العملاء" title="ماذا يقول عملاؤنا" />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="glass shadow-luxury rounded-3xl p-8"
            >
              <div className="mb-3 flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-lg leading-relaxed text-secondary">"{r.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="gold-gradient grid h-12 w-12 place-items-center rounded-full font-bold text-secondary">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-secondary">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.city}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "هل الرائحة تدوم؟", a: "نعم، تدوم لساعات طويلة يمكن أن تصل إلى 8 ساعات." },
    { q: "هل المنتج أصلي؟", a: "نعم، أصلي 100٪ ومصنوع من مكونات طبيعية بالكامل." },
    { q: "هل يوجد توصيل؟", a: "نعم إلى جميع ولايات الجزائر، مع إمكانية الدفع عند الاستلام." },
    { q: "كم يستغرق التوصيل؟", a: "من 2 إلى 5 أيام حسب الولاية." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <SectionHeading kicker="الأسئلة الشائعة" title="كل ما تريد معرفته" />
        <div className="mt-16 space-y-4">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass overflow-hidden rounded-2xl"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-6 text-right"
              >
                <span className="text-lg font-bold text-secondary">{f.q}</span>
                <ChevronDown className={`h-5 w-5 text-[color:var(--gold-dark)] transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-muted-foreground">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const wilayas = [
  "أدرار","الشلف","الأغواط","أم البواقي","باتنة","بجاية","بسكرة","بشار","البليدة","البويرة",
  "تمنراست","تبسة","تلمسان","تيارت","تيزي وزو","الجزائر","الجلفة","جيجل","سطيف","سعيدة",
  "سكيكدة","سيدي بلعباس","عنابة","قالمة","قسنطينة","المدية","مستغانم","المسيلة","معسكر","ورقلة",
  "وهران","البيض","إليزي","برج بوعريريج","بومرداس","الطارف","تندوف","تيسمسيلت","الوادي","خنشلة",
  "سوق أهراس","تيبازة","ميلة","عين الدفلى","النعامة","عين تموشنت","غرداية","غليزان",
];

function OrderForm() {
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState("العلبة الكبيرة — 3400 DA");
  const [submitted, setSubmitted] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };
  return (
    <section id="order" className="py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <SectionHeading kicker="اطلب الآن" title="أكمل طلبك بسهولة" />
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass shadow-luxury mt-16 rounded-3xl p-8 md:p-12"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="الاسم الكامل" name="name" required />
            <Field label="رقم الهاتف" name="phone" type="tel" required />
            <div>
              <label className="mb-2 block text-sm font-bold text-secondary">الولاية</label>
              <select required className="w-full rounded-2xl border border-input bg-white/70 px-4 py-3 text-secondary outline-none focus:border-primary">
                <option value="">اختر الولاية</option>
                {wilayas.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <Field label="البلدية" name="commune" required />
            <div className="md:col-span-2">
              <Field label="العنوان" name="address" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-secondary">اختر المنتج</label>
              <select
                value={product} onChange={(e) => setProduct(e.target.value)}
                className="w-full rounded-2xl border border-input bg-white/70 px-4 py-3 text-secondary outline-none focus:border-primary"
              >
                <option>العلبة الكبيرة — 3400 DA</option>
                <option>العلبة الصغيرة — 2000 DA</option>
                <option>عرض علبتين كبيرتين — 6000 DA</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-secondary">الكمية</label>
              <div className="flex items-center gap-3 rounded-2xl border border-input bg-white/70 p-2">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                  <Minus className="h-4 w-4" />
                </button>
                <div className="flex-1 text-center text-lg font-bold text-secondary">{qty}</div>
                <button type="button" onClick={() => setQty(qty + 1)} className="grid h-10 w-10 place-items-center rounded-xl gold-gradient text-secondary">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit"
            className="gold-gradient shadow-gold mt-8 flex w-full items-center justify-center gap-2 rounded-full py-5 text-lg font-bold text-secondary"
          >
            <Check className="h-6 w-6" />
            تأكيد الطلب
          </motion.button>
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-4 rounded-2xl bg-success/15 p-4 text-center text-success font-semibold"
              >
                تم استلام طلبك بنجاح! سنتصل بك قريباً.
              </motion.div>
            )}
          </AnimatePresence>
          <p className="mt-4 text-center text-sm text-muted-foreground">💰 الدفع عند الاستلام — 🚚 توصيل لكل الولايات</p>
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
        type={type} name={name} required={required} maxLength={100}
        className="w-full rounded-2xl border border-input bg-white/70 px-4 py-3 text-secondary outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-2xl text-center"
    >
      <div className="mb-3 text-sm font-bold uppercase tracking-widest text-[color:var(--gold-dark)]">
        · {kicker} ·
      </div>
      <h2 className="font-arabic-display text-4xl font-bold text-secondary md:text-5xl">{title}</h2>
      <div className="mx-auto mt-4 h-px w-24 gold-gradient" />
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 bg-secondary py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <div className="mx-auto mb-6 gold-gradient grid h-16 w-16 place-items-center rounded-full shadow-gold">
          <Sparkles className="h-8 w-8 text-secondary" />
        </div>
        <h3 className="gold-text font-arabic-display text-3xl font-bold">بخور البيلسان الأصلي</h3>
        <p className="mt-2 text-white/70">من أعماق الصحراء الجزائرية</p>
        <div className="mx-auto my-8 h-px w-32 gold-gradient" />
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <a href="#home" className="hover:text-primary">الرئيسية</a>
          <a href="#pricing" className="hover:text-primary">الأسعار</a>
          <a href="#gallery" className="hover:text-primary">الصور</a>
          <a href="#order" className="hover:text-primary">اطلب الآن</a>
        </div>
        <p className="mt-8 text-xs text-white/50">حقوق النشر © 2026 — جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}

function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/30 bg-white/95 p-3 backdrop-blur-xl shadow-luxury lg:hidden">
        <a
          href="#order"
          className="gold-gradient flex items-center justify-center gap-2 rounded-full py-3 font-bold text-secondary shadow-gold"
        >
          <ShoppingBag className="h-5 w-5" /> اطلب الآن
        </a>
      </div>

      {/* WhatsApp */}
      <a
        href="https://wa.me/213000000000"
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-20 left-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-luxury transition-transform hover:scale-110 lg:bottom-6"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {/* Back to top */}
      <AnimatePresence>
        {show && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="gold-gradient fixed bottom-36 left-4 z-40 grid h-12 w-12 place-items-center rounded-full text-secondary shadow-gold lg:bottom-24"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

function Landing() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="relative min-h-screen">
      <AnimatePresence>{loading && <Loader onDone={() => setLoading(false)} />}</AnimatePresence>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <About />
        <Pricing />
        <Gallery />
        <HowToUse />
        <Reviews />
        <FAQ />
        <OrderForm />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
