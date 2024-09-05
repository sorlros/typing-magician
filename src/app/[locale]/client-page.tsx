"use client";

import React, { useEffect } from "react"
import Header from "./components/header";
import { FileContentArray, LangType } from "../libs/types";
import GameComponent from "./components/game-component";
import TypingArea from "./components/typing-area/typing-area";
import SelectText from "./components/select-text";

interface PageProps {
  lang: LangType;
  text: FileContentArray;
}

const ClientComponentPage = ({ lang, text }: PageProps) => {

  useEffect(() => {
    console.log("lang", lang);
  }, []);

  return (
    <div className="px-32">
      <Header lang={lang}/>
      <SelectText text={text} />
      <GameComponent />
      <TypingArea text={text}/>
    </div>
  )
}

export default ClientComponentPage;