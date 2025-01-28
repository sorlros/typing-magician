"use client";

import { useEffect, useState } from "react";
import LocalePage from "./[locale]/page";

export default function Home() {
  const [locale, setLocale] = useState<string>("ko");

  useEffect(() => {
    const fetchLocale = async () => {
      const response = await fetch("/api/get-locale");
      const data = await response.json();
      setLocale(data.locale as string);
    };

    fetchLocale();
  }, []);

  return (
    <LocalePage params={{ locale }} />
  );
}
