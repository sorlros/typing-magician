import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { nextUrl: url } = request;
  const locale = request.headers.get("accept-language")?.split(",")[0] || "ko";
  console.log(")
  // URL 파라미터를 사용하는 경우
  if (locale === "ko" || locale === "ko-KR") {
    // /ko로 리디렉션
    url.pathname = `/ko${url.pathname}`;
  } else {
    // /en으로 리디렉션
    url.pathname = `/en${url.pathname}`;
  }

  // URL의 새로운 경로로 리디렉션
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/ko/:path*", "/en/:path*"]
}