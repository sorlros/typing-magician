import { create } from "zustand";

interface StageStore {
  stage: number;
  setNextStage: () => void;
  modalState: "close" | "open";
  setModalState: (state: "close" | "open") => void;
  resetStage: () => void;
}

const useStageStore = create<StageStore>((set, get) => ({
  stage: 0,
  setNextStage: () => {
    const { stage } = get();
    set({ stage: stage + 1})
  },
  modalState: "close",
  setModalState: (state) => {
    set({ modalState: state })
  },
  resetStage: () => {
    set({ stage: 0 })
  },
}))

export default useStageStore;