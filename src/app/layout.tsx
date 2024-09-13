import type { Metadata } from "next"
import "../../i18n";
import { Inter } from "next/font/google"
import "./globals.css"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "로그라이크 & 타이핑 | TypePulse",
  description: "Next.js로 제작된 타이핑 사이트입니다. 타이핑과 로그라이크를 결합한 웹사이트로 유저에게 더 즐거운 타이핑 경험을 제공합니다.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
