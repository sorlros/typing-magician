"use client";

import React, { useEffect } from "react"
import Header from "./components/header";
import { LangType } from "../libs/types";

interface PageProps {
  lang: LangType;
}

const ClientComponentPage = ({ lang }: PageProps) => {

  useEffect(() => {
    console.log("lang", lang);
  }, [])

  return (
    <div className="px-32">
      <Header lang={lang}/>
    </div>
  )
}

export default ClientComponentPage;