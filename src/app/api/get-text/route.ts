"use server";

import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";


export async function GET(req: NextRequest, res: NextResponse) {
  // const filePath = path.join(process.cwd(), "public", "text", "*.txt")
  const dirPath = path.join(process.cwd(), "public", "text");

  try {
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith(".txt"));
    const fileContents = await Promise.all(files.map(async (file) => {
      const filePath = path.join(dirPath, file);
      const content = await fs.promises.readFile(filePath, "utf8");
      
      return { file, content };
    }));
    
    const response = NextResponse.json(fileContents);

    response.headers.set("Access-Control-Allow-Origin", "*"); // 또는 특정 도메인
    response.headers.set("Access-Control-Allow-Methods", "GET");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    console.log("getText 완료");
    return response;
  } catch (error) {
    return NextResponse.json({ error: "getText 오류" }, { status: 500 });
  }
}