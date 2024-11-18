import decomposeKorean from "@/app/[locale]/components/typing-area/decompose-korean";
import { create } from "zustand";

interface TextStore {
  text: {
    contents: string[]
  };
  typedText: string;
  decomposedText: string[][];
  setDecomposedText: (content: string[][]) => void;
  setText: (texts: string[]) => void;
  setTypedText: (typedText: string) => void;
}

export const useTextStore = create<TextStore>((set, get) => ({
  text: {
    // title: "",
    contents: [""],
  },
  typedText: "",
  decomposedText: [[""]],
  setText: (texts) => {
    const { text } = get();

    set({
      text: {
        contents: texts
      }
    })

    // console.log("after setText", text)
    // console.log("typeof setText", typeof text)
    // console.log("setText 01", text.contents[0])
  },
  setDecomposedText: (decomposedContent) => {
    set({
      decomposedText: decomposedContent
    })

    // console.log("분리된 store의 Text", decomposedContent);
  },
  setTypedText: (typedText: string) => set({ typedText })
}))