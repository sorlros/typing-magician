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
  setText: (text: TextItem) => set({ text }),
  setTypedText: (typedText: string) => set({ typedText })
}))