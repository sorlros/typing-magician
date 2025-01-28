import { useTranslation } from "react-i18next";
import { LangType } from "../../libs/types";
import Link from "next/link";
import { Handjet } from 'next/font/google';
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface HeaderProps {
  lang: LangType;
}

const handjet = Handjet({
  weight: ['400', '700'],
  subsets: ['latin'], // 폰트 서브셋
});

const Header = ({ lang }: HeaderProps) => {
  const { t } = useTranslation();
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
        <Link href="/">{t("header.typing_magician")}</Link>
      </div>

      <div className={cn(`flex justify-end space-x-6 text-xl`, handjet.className)}>
        <div className="cursor-pointer">
          <Link href="/contact">{t("header.Contact")}</Link>
        </div>
        <div>
          <Link href="/upload">{t("header.Upload")}</Link>
        </div>
        <div>
          <Link href="/account">{t("header.Account")}</Link>
        </div>
        <div>
          <Link href="/patch">{t("header.Patched")}</Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
