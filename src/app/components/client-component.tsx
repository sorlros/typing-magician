"use client";

import { useParams } from "next/navigation";

export default function ClientComponent() {
  const { locale } = useParams();

  return (
    <div>
      {/* 클라이언트 컴포넌트에서 locale을 사용할 수 있습니다. */}
      <p>Current Locale: {locale}</p>
    </div>
  );
}
