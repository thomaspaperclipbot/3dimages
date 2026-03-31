import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "es", "pt"] as const;
const DEFAULT_LOCALE = "en";

function getLocaleFromAcceptLanguage(header: string | null): string {
  if (!header) return DEFAULT_LOCALE;

  const locales = header
    .split(",")
    .map((part) => part.trim().split(";")[0])
    .filter(Boolean);

  for (const locale of locales) {
    const normalized = locale.toLowerCase().split("-")[0];
    if (LOCALES.includes(normalized as (typeof LOCALES)[number])) {
      return normalized;
    }
  }

  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = getLocaleFromAcceptLanguage(
    request.headers.get("accept-language")
  );

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
