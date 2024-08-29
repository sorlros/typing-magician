"use client";

import { useParams } from "next/navigation";
import MainPage from "./[locale]/page";
import { useEffect, useState } from "react";
import { LocaleProps } from "./libs/types";

export default function Home() {  
  const [locale, setLocale] = useState<string>("ko");

  useEffect(() => {
    const fetchLocale = async () => {
      const response = await fetch("/api/get-locale");
      const data = await response.json();
      setLocale(data.locale);
    };

    fetchLocale();
  }, []);
  
  return (
    <>
      <MainPage locale={locale} />
    </>
  );
}