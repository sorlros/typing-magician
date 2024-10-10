import { create } from "zustand";

interface SituationStore {
  inUsual: boolean;
  inCombat: boolean;
  isDying: boolean;
  isHurt: boolean;
  setSituations: (value: string) => void;
}

const useSituationStore = create<SituationStore>((set, get) => ({
  inUsual: true,
  inCombat: false,
  isDying: false,
  isHurt: false,
  setSituations: (value) => {
    if (value === "inUsual") {
      set({
        inUsual: true,
        inCombat: false,
        isDying: false,
        isHurt: false,
      })
    } else if (value === "inCombat") {
      set({
        inUsual: false,
        inCombat: true,
        isDying: false,
        isHurt: false,
      })
    } else if (value === "isHurt") {
      set({
        inUsual: false,
        inCombat: true,
        isDying: false,
        isHurt: true,
      })
    } else if (value === "isDying") {
      set({
        inUsual: false,
        inCombat: true,
        isDying: true,
        isHurt: false,
      })
    }
  }
}))

export default useSituationStore;