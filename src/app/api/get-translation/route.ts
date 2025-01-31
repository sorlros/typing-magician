// import fs from "fs";
// import { NextRequest, NextResponse } from "next/server";
// import path from "path";


// export async function GET(req: NextRequest, res: NextResponse) {
//   const { searchParams } = new URL(req.url);
//   console.log("params", searchParams.get("locale"));
//   const locale = searchParams.get("locale");

//   if (!locale) {
//     return NextResponse.json({ error: "locale 오류"}, { status: 400 });
//   }

//   const filePath = path.join(process.cwd(), "public", "locales", `${locale}`, "lang.json")

//   try {
//     const content = fs.readFileSync(filePath, "utf8");
//     const response = NextResponse.json(JSON.parse(content));

//     response.headers.set("Access-Control-Allow-Origin", "*"); // 또는 특정 도메인
//     response.headers.set("Access-Control-Allow-Methods", "GET");
//     response.headers.set("Access-Control-Allow-Headers", "Content-Type");

//     console.log("getTranslation 호출 성공");
//     return response;
//   } catch (error) {
//     return NextResponse.json({ error: "locales 번역 파일 오류" }, { status: 500 });
//   }
// }

import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale");

  if (!locale) {
    return NextResponse.json({ error: "locale 오류" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "locales", locale, "lang.json");

  try {
    const content = await fs.readFile(filePath, "utf8");
    return new NextResponse(content, {
      status: 200,
      headers: new Headers({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // 또는 특정 도메인
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      }),
    });
  } catch (error) {
    return NextResponse.json({ error: "locales 번역 파일 오류" }, { status: 500 });
  }
}
