import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { programSlugs } from "./content/programs";
import { routing } from "./i18n/routing";

// Next 16 renamed `middleware.ts` to `proxy.ts`. next-intl handles the
// locale prefix: "/" → "/id", "/programs/pre-toefl" → "/id/programs/pre-toefl".
const handleI18n = createMiddleware(routing);

const programPath = new RegExp(`^/(${routing.locales.join("|")})/programs/([^/]+)/?$`);

export default function proxy(request: NextRequest) {
  // Cache Components doesn't support `dynamicParams = false`, so unknown
  // program slugs are sent to an unmatched path here → a real 404 status.
  const match = request.nextUrl.pathname.match(programPath);
  if (match && !(programSlugs as readonly string[]).includes(match[2])) {
    return NextResponse.rewrite(new URL(`/${match[1]}/__not-found`, request.url));
  }
  return handleI18n(request);
}

export const config = {
  // Skip Next internals, API routes and any path with a file extension
  // (images, icons, sitemap.xml, robots.txt, …).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
