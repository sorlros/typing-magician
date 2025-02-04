import { useTranslation } from "react-i18next";
import { LangType } from "../../libs/types";
import Link from "next/link";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";


interface HeaderProps {
  lang: LangType;
}

const handjet = localFont({
  src: "../../../../public/fonts/Handjet,New_Amsterdam/Handjet/static/Handjet-Light.ttf",
  weight: "400",
  display: "swap",
});

const Header = () => {
  // const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  // 클라이언트에서만 폰트 적용
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // 서버 렌더링 시에는 아무것도 렌더링하지 않음
  }

  return (
    <div className="flex w-full h-[120px] relative justify-between text-white items-center z-50">
      <div className={cn(`flex justify-start w-[120px] text-2xl`, handjet.className)}>
        {/* <Link href="/">{t("header.typing_magician")}</Link> */}
        <Link href="/">Typing_magician</Link>
      </div>

      <div className={cn(`flex justify-end space-x-6 text-xl`, handjet.className)}>
        <div className="cursor-pointer">
          {/* <Link href="/contact">{t("header.Contact")}</Link> */}
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          {/* <Link href="/upload">{t("header.Upload")}</Link> */}
          <Link href="/upload">Upload</Link>
        </div>
        <div>
          {/* <Link href="/account">{t("header.Account")}</Link> */}
          <Link href="/account">Account</Link>
        </div>
        <div>
          {/* <Link href="/patch">{t("header.Patched")}</Link> */}
          <Link href="/patch">Patched</Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
