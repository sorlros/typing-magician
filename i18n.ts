"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 기본 i18n 설정
i18n
  .use(initReactI18next)
  .init({
    lng: "ko", // 기본 언어 설정
    fallbackLng: "ko", // 언어가 없을 경우 대체 언어 설정
    interpolation: {
      escapeValue: false, // XSS 방지
    },
    resources: {}, // 초기 설정 시 빈 객체로 시작
  });

export default i18n;