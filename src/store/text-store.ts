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
  currentIndex: number;
  initializeIndex: () => void;
  // subscribeToTextChanges: (callback: () => void) => () => void;
}

export const useTextStore = create<TextStore>((set, get, api) => ({
  text: {
    // title: "",
    contents: [""],
  },
  typedText: "",
  decomposedText: [[""]],
  setText: (texts) => {
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
  setTypedText: (typedText: string) => set({ typedText }),
  currentIndex: 0,
  initializeIndex: () => {
    const { text } = get();

    if (text.contents.length > 0) {
      const randomIndex = Math.floor(Math.random() * text.contents.length);
      set({ currentIndex: randomIndex });
    }
  },
  // subscribeToTextChanges: (callback) => {
  //   const unsubscribe = api.subscribe(
  //     (state) => state.text.contents,
      
  //   );
  //   return unsubscribe; 
  // },
}))