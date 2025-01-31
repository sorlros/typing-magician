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
  // const response = await fetch(`http://localhost:3000/api/get-translation?locale=${locale}`);
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-translation?locale=${locale}`);
  // // console.log("fetchLangFromServer 응답 상태 코드:", response.status);
  
  // if (!response.ok) {
  //   throw new Error("get-translation fetch 오류");
  // }
  // const contentType = response.headers.get("content-type");
  // if (!contentType || !contentType.includes("application/json")) {
  //   const text = await response.text();
  //   console.error("get-translation 응답이 JSON이 아님:", text);
  //   throw new Error("get-translation JSON 변환 오류 (응답이 JSON 형식이 아님)");
  // }

  // return response.json();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/get-translation?locale=${locale}`;
  console.log("Fetching:", url);

  const response = await fetch(url);
  console.log("Response status:", response.status);

  const contentType = response.headers.get("content-type");
  console.log("Content-Type:", contentType);

  const text = await response.text();
  console.log("Response text:", text);

  if (!response.ok) {
    throw new Error(`get-translation fetch 오류 (상태 코드: ${response.status})`);
  }

  if (!contentType || !contentType.includes("application/json")) {
    console.error("get-translation 응답이 JSON이 아님:", text);
    throw new Error("get-translation JSON 변환 오류 (응답이 JSON 형식이 아님)");
  }

  return JSON.parse(text);

  
}

// 서버에서 텍스트 데이터를 가져오는 함수
async function fetchTextFromPublic() {
  // const response = await fetch(`http://localhost:3000/api/get-text`);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-text`);
  
  // const text = await response.text();
  // console.log("fetchTextFromPublic 응답 상태 코드:", response.status);

  // const text = await response.text(); // JSON인지 확인하기 위해 text로 받음
  // console.log("fetchLangFromServer 응답 내용:", text); // 응답 내용 출력

  if (!response.ok) {
    throw new Error("get-text fetch 오류");
  }

  // const json = JSON.parse(text);

  return response.json();
  // return json;
}
