import { create } from "zustand";

interface TextItem {
  title: string;
  content: string;
}

interface TextStore {
  text: TextItem;
  typedText: string;
  setText: (texts: TextItem) => void;
  setTypedText: (typedText: string) => void;
}

export const useTextStore = create<TextStore>((set) => ({
  text: {
    title: "",
    content: "",
  },
  typedText: "",
  setText: (text: TextItem) => {
    const cleanContent = text.content.replace(/\s+/g, ' ');
    
    set({
      text: {
        ...text,
        content: cleanContent,
      }
    });
  },
  setTypedText: (typedText: string) => set({ typedText })
}))