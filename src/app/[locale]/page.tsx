import i18n from "../../../i18n";
import LocalePageLayout from "./layout";
import dynamic from "next/dynamic";

const ClientComponentPage = dynamic(() => import("./client-page"), {
  ssr: false, // 서버 사이드 렌더링 방지
});

export default async function LocalePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const validLocales = ["ko", "en"];

  // 유효하지 않은 locale 처리
  if (!validLocales.includes(locale)) {
    return (
      <div>
        <span>현재 해당 웹페이지는 한국어와 영어만 지원하고 있습니다.</span>
        <span>This website currently supports only Korean and English.</span>
      </div>
    );
  }

  const lang = await fetchLangFromServer(locale);
  const text = await fetchTextFromPublic();

  i18n.addResourceBundle(locale, "translation", lang, true, true);
  i18n.changeLanguage(locale);

  return (
    <LocalePageLayout>
      <div className="w-full h-full px-16 py-2">
        <ClientComponentPage lang={lang} text={text} />
      </div>
    </LocalePageLayout>
  );
}

// 서버에서 언어 데이터를 가져오는 함수
async function fetchLangFromServer(locale: string) {
  const response = await fetch(`http://localhost:3000/api/get-translation?locale=${locale}`);

  if (!response.ok) {
    throw new Error("get-translation fetch 오류");
  }

  return response.json();
}

// 서버에서 텍스트 데이터를 가져오는 함수
async function fetchTextFromPublic() {
  const response = await fetch(`http://localhost:3000/api/get-text`);

  if (!response.ok) {
    throw new Error("get-text fetch 오류");
  }

  return response.json();
}
