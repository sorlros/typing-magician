"use client";

import React, { useEffect } from "react"
import Header from "./components/header";
import { FileContentArray, LangType, TextItem } from "../libs/types";
import GameComponent from "./components/game-component";
import TypingArea from "./components/typing-area/typing-area";
import SelectText from "./components/select-text";
import { useTextStore } from "@/store/use-text-store";

interface PageProps {
  lang: LangType;
  text: TextItem[];
}

const ClientComponentPage = ({ lang, text: literature }: PageProps) => {
  const { setText, typedText, setTypedText } = useTextStore((state) => ({
    setText: state.setText,
    typedText: state.typedText,
    setTypedText: state.setTypedText,
  }));

  useEffect(() => {
    setText(literature[0])
  }, [literature, setText]);

  return (
    <div className="px-60">
      <Header lang={lang}/>
      <GameComponent />
      <TypingArea />
      <SelectText text={literature} />
    </div>
  )
}

export default ClientComponentPage;