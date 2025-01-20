import { create } from "zustand";

interface StageStore {
  stage: number;
  stageImage: string;
  setNextStage: () => void;
  modalState: "close" | "open";
  setModalState: (state: "close" | "open") => void;
  resetStage: () => void;
}

const useStageStore = create<StageStore>((set, get) => ({
  stage: 1,
  stageImage: "/game_images/background/PNG/Battleground1/Bright/Battleground1.png",
  setNextStage: () => {
    const { stage } = get();
    const nextStage = stage + 1;
    set({
      stage: nextStage,
      stageImage: `/game_images/background/PNG/Battleground${nextStage}/Bright/Battleground${nextStage}.png`,
    });
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