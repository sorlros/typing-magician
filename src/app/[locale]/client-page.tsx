"use client";

import React, { useEffect } from "react"
import Header from "./components/header";
import { LangType } from "../libs/types";
import GameComponent from "./components/game-component";
import TypingArea from "./components/typing-area/typing-area";
import { useTextStore } from "@/store/text-store";
import ChoiceModal from "./components/modal/choice-modal";
import GameEndModal from "./components/modal/game-end-modal";


interface PageProps {
  // lang: LangType;
  text: string;
}

const ClientComponentPage = ({ text: phrase }: PageProps) => {
  
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
      <Header />
      <div className="relative">
        <GameComponent />
        <TypingArea />  
        <GameEndModal />
      </div>
      <ChoiceModal />
      {/* <ItemList /> */}
      {/* <SelectText text={literature} /> */}
    </div>
  )
}

export default ClientComponentPage;