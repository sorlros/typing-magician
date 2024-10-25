import { create } from "zustand";

interface TextStore {
  text: {
    contents: string[]
  };
  typedText: string;
  setText: (texts: string) => void;
  setTypedText: (typedText: string) => void;
}

export const useTextStore = create<TextStore>((set) => ({
  text: {
    // title: "",
    contents: [""],
  },
  typedText: "",
  setText: (texts) => {
    const separateText = texts.split('"').filter((text, index) => index % 2 !== 0);
    // const contentList = contents.map((content) => ([{content}]));

    set({
      text: {
        contents: separateText.map(content => content.trim()).filter(content => content.length > 0)
      }
    })

    // const cleanContent = texts.content.replace(/\s+/g, ' ');
    
    // set({
    //   text: {
    //     // ...text,
    //     content: contentList,
    //   }
    // });
  },
  setTypedText: (typedText: string) => set({ typedText })
}))