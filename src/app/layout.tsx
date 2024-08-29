import type { Metadata } from "next"
import "../../i18n";
import { Inter } from "next/font/google"
import "./globals.css"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "더 나은 타이핑 경험과 다양한 테마 | TypePulse",
  description: "Next.js와 Tailwindcss로 제작된 타이핑 사이트입니다. SSR을 활용했으며 타이핑 속도와 정확도를 향상시키기 위한 사이트입니다.",
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
