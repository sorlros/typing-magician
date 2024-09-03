"use client";

import React, { useEffect } from "react"
import Header from "./components/header";
import { FileContentArray, LangType } from "../libs/types";
import GameComponent from "./components/game-component";

interface PageProps {
  lang: LangType;
  content: FileContentArray;
}

const ClientComponentPage = ({ lang, content }: PageProps) => {

  useEffect(() => {
    console.log("lang", lang);
    console.log("content", content);
  }, []);

  return (
    <div className="px-32">
      <Header lang={lang}/>
      <GameComponent />
    </div>
  )
}

export default ClientComponentPage;