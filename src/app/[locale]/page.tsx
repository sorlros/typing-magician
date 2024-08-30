import ClientComponentPage from "./client-page";
import i18n from "../../../i18n";
import LocalePageLayout from "./layout";

type LangType = {
  header: {
    [key: string]: string;
  };
  nav: {
    [key: string]: string;
  };
};

export default async function LocalePage ({locale}: {locale: string}) {
  
  const validLocales = ["ko", "en"];
  if (!validLocales.includes(locale)) {
    return (
      <div>
        <span>현재 해당 웹페이지는 한국어와 영어만 지원하고 있습니다.</span>
        <span>This website currently supports only Korean and English.</span>
      </div>
    )
  }

  const lang = await fetchLangFromServer(locale);

  i18n.addResourceBundle(locale, 'translation', lang, true, true);
  i18n.changeLanguage(locale);

  return (
    <LocalePageLayout>
      <div className="w-full h-full px-16 py-6">
        <ClientComponentPage lang={lang}/>
      </div>
    </LocalePageLayout>
  )
}

async function fetchLangFromServer(locale: string): Promise<LangType> {
  const response = await fetch(`http://localhost:3000/api/get-translation?locale=${locale}`);

  if (!response.ok) {
    throw new Error("get-translation fetch 오류");
  }

  const data: LangType = await response.json();
  return data;
}