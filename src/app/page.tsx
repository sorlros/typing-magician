"use client";

import { useEffect, useState } from "react";
import LocalePage from "./[locale]/page";

export default function Home() {
  // const [locale, setLocale] = useState<string>("ko");
  // const [translation, setTranslation] = useState(null);

  // useEffect(() => {
  //   const fetchLocale = async () => {
  //     try {
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-locale`);
  //       const data = await response.json();
  //       setLocale(data.locale);
  //     } catch (error) {
  //       console.error("Error fetching locale:", error);
  //     }
  //   };

  //   fetchLocale();
  // }, []);

  // useEffect(() => {
  //   if (!locale) return;
    
  //   const fetchTranslation = async () => {
  //     try {
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-translation?locale=${locale}`);
  //       if (!response.ok) throw new Error(`get-translation fetch 오류 (상태 코드: ${response.status})`);
  //       const data = await response.json();
  //       setTranslation(data);
  //     } catch (error) {
  //       console.error("Error fetching translation:", error);
  //     }
  //   };

  //   fetchTranslation();
  // }, [locale]);

  // if (!translation) return <p>Loading...</p>;

  return <LocalePage />;
}
