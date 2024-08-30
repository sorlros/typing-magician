import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // `Accept-Language` 헤더를 직접 가져오는 방식
  const headers = request.headers;
  const locale = headers.get("accept-language")?.split(",")[0] || "ko";
  // console.log("현재 locale", locale);

  return NextResponse.json({ locale });
}
