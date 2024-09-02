"use client";

import React, { useEffect } from "react"
import Header from "./components/header";
import { FileContentArray, LangType } from "../libs/types";
import DotsComponent from "./components/dots-component";

interface PageProps {
  lang: LangType;
  content: FileContentArray;
}

const ClientComponentPage = ({ lang, content }: PageProps) => {

  useEffect(() => {
    console.log("lang", lang);
  }, [])

  return (
    <div className="px-32">
      <Header lang={lang}/>
      <DotsComponent />
    </div>
  )
}

export default ClientComponentPage;