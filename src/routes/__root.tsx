import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { trackPageView } from "../lib/pixel";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const siteUrl = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, "");
const OG_IMAGE = `${siteUrl}/WhatsApp Image 2026-07-30 at 14.16.08.jpeg`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" dir="rtl">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" dir="rtl">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          حدث خطأ ما
        </h1>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            أعد المحاولة
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "عشبة العلندة الخضراء — عشبة طبيعية فعالة لعلاج العديد من الأمراض" },
      { name: "description", content: "عشبة العلندة الخضراء 100% طبيعية. تعالج اضطرابات الجهاز التنفسي والهضمي وتقوي المناعة وتنشط الدورة الدموية. اطلب الآن مع التوصيل لكل الولايات والدفع عند الاستلام." },
      { name: "keywords", content: "عشبة العلندة, العلندة الخضراء, أعشاب طبيعية, علاج طبيعي, تقوية المناعة, أعشاب جزائرية" },
      { property: "og:title", content: "عشبة العلندة الخضراء — أصلي وطبيعي 100%" },
      { property: "og:description", content: "عشبة طبيعية فعالة لعلاج اضطرابات الجهاز التنفسي والهضمي، تقوي المناعة وتنشط الدورة الدموية. توصيل لكل الجزائر." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ar_DZ" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "عشبة العلندة الخضراء الطبيعية" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "عشبة العلندة الخضراء — أصلي وطبيعي 100%" },
      { name: "twitter:description", content: "عشبة طبيعية فعالة لعلاج اضطرابات الجهاز التنفسي والهضمي، تقوي المناعة وتنشط الدورة الدموية. توصيل لكل الجزائر." },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: "عشبة العلندة الخضراء الطبيعية" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/a5a2f101-4cd1-432b-a47a-82fd598c99c7.jfif", type: "image/jpeg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Cairo:wght@300;400;600;700;900&family=Amiri:wght@400;700&display=swap" },
    ],
    // Meta Pixel base code — managed by TanStack Router head() to avoid SSR/hydration mismatch.
    // fbq('init') only. PageView is fired client-side in RootComponent via useEffect.
    scripts: [
      {
        children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','2104297943797519');`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
        {/* noscript fallback for Meta Pixel (cannot live in scripts[] array). */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2104297943797519&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Fire PageView once on initial client-side hydration.
  // trackPageView() is idempotent — safe against React StrictMode double-invoke.
  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
