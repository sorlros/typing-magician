"use server";

import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";


export async function GET(req: NextRequest, res: NextResponse) {
  // const filePath = path.join(process.cwd(), "public", "text", "*.txt")
  // const allowedOrigin = process.env.NEXT_PUBLIC_API_URL as string;
  const allowedOrigin = "https://typing-magician.vercel.app";
  const dirPath = path.join(process.cwd(), "public", "text");

  try {
    const titles = fs.readdirSync(dirPath).filter(title => title === "shorts.txt");

    if (titles.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "shorts.txt 파일을 찾을 수 없습니다." }),
        { status: 404, headers: { "Access-Control-Allow-Origin": allowedOrigin } }
      );
    }

    const filePath = path.join(dirPath, "shorts.txt");
    const content = await fs.promises.readFile(filePath, "utf8");

    return new NextResponse(
      JSON.stringify({ content }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "getText 오류" }),
      { status: 500, headers: { "Access-Control-Allow-Origin": allowedOrigin } }
    );
  }
}