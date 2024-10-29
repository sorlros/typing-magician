import { create } from "zustand";

interface TextStore {
  text: {
    contents: string[]
  };
  typedText: string;
  setText: (texts: string[]) => void;
  setTypedText: (typedText: string) => void;
}

export const useTextStore = create<TextStore>((set, get) => ({
  text: {
    // title: "",
    contents: [""],
  },
  typedText: "",
  setText: (texts) => {
    // const separateText = texts.split('"').filter((text, index) => index % 2 !== 0);
    // // const contentList = contents.map((content) => ([{content}]));
    const { text } = get();

    set({
      text: {
        contents: texts
      }
    })

    // const cleanContent = texts.content.replace(/\s+/g, ' ');
    
    // set({
    //   text: {
    //     // ...text,
    //     content: contentList,
    //   }
    // });
    console.log("after setText", text)
    console.log("typeof setText", typeof text)
    console.log("setText 01", text.contents[0])
  },
  setTypedText: (typedText: string) => set({ typedText })
}))