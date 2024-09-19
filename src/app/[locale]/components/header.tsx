import { useTranslation } from "react-i18next";
import { LangType } from "../../libs/types"
import Link from "next/link";
import { Handjet, Sunflower } from 'next/font/google';
import { cn } from "@/lib/utils";

interface HeaderProps {
  lang: LangType;
}

const sunFlower = Sunflower({
  weight: ["500", "700"],
  subsets: ["latin"]
})

const handjet = Handjet({
  weight: ['400', '700'],
  subsets: ['latin'], // 폰트 서브셋
});

const Header = ({lang}: HeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full h-[120px] justify-between text-white items-center">
      <div className={cn(`flex justify-start w-[120px] text-2xl`, handjet.className)}>
        <Link href="/">{t("header.typing_magician")}</Link>
      </div>

      <div className={cn(`flex justify-end space-x-6 text-xl`, handjet.className)}>
        <div>
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
  )
}

export default Header