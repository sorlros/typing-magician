"use client";

import React, { useEffect } from "react"
import Header from "./components/header";
import { FileContentArray, LangType, TextItem } from "../libs/types";
import GameComponent from "./components/game-component";
import TypingArea from "./components/typing-area/typing-area";
import SelectText from "./components/select-text";
import { useTextStore } from "@/store/use-text-store";
import HpAndSkills from "./components/hp-mp-ui/hp-mp";

interface PageProps {
  lang: LangType;
  text: string;
}

const ClientComponentPage = ({ lang, text: phrase }: PageProps) => {
  const { text, setText, typedText, setTypedText } = useTextStore((state) => ({
    text: state.text,
    setText: state.setText,
    typedText: state.typedText,
    setTypedText: state.setTypedText,
  }));

  useEffect(() => {
    setText(phrase);
    console.log("text", text);
  }, [phrase, setText]);

  return (
    <div className="px-60">
      <Header lang={lang}/>
      <GameComponent />
      <TypingArea />
      {/* <SelectText text={literature} /> */}
    </div>
  )
}

export default ClientComponentPage;