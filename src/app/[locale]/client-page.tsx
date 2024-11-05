"use client";

import React, { useEffect } from "react"
import Header from "./components/header";
import { FileContentArray, LangType, TextItem } from "../libs/types";
import GameComponent from "./components/game-component";
import TypingArea from "./components/typing-area/typing-area";
import SelectText from "./components/select-text";
import { useTextStore } from "@/store/use-text-store";
import HpAndSkills from "./components/hp-mp-ui/hp-mp";
import ChoiceModal from "./components/modal/choice-modal";
import ItemList from "./components/game-area/item/item-list";

interface PageProps {
  lang: LangType;
  text: string;
}

const ClientComponentPage = ({ lang, text: phrase }: PageProps) => {
  const separateText = (text: string) => {
    return text.split(/"\s*"/).map(item => item.replace(/"/g, "").trim());
  }

  const { text, setText, typedText, setTypedText } = useTextStore((state) => ({
    text: state.text,
    setText: state.setText,
    typedText: state.typedText,
    setTypedText: state.setTypedText,
  }));

  useEffect(() => {
    const mapText = separateText(phrase);
    setText(mapText);
  }, [phrase, setText]);

  return (
    <div className="px-60">
      <Header lang={lang}/>
      <GameComponent />
      <TypingArea />
      <ChoiceModal />
      <ItemList />
      {/* <SelectText text={literature} /> */}
    </div>
  )
}

export default ClientComponentPage;