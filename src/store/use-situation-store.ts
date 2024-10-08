import { create } from "zustand";

interface SituationStore {
  inUsual: boolean;
  inCombat: boolean;
  isDying: boolean;
  isHurt: boolean;
  setSituations: () => void;
}

const useSituationStore = create<SituationStore>((set, get) => ({
  inUsual: true,
  inCombat: false,
  isDying: false,
  isHurt: false,
  setSituations: () => {
    const { inUsual, inCombat, isDying, isHurt } = get();

    if (inUsual) {
      set({
        inUsual: true,
        inCombat: false,
        isDying: false,
        isHurt: false,
      })
    } else if (inCombat) {
      set({
        inUsual: false,
        inCombat: true,
        isDying: false,
        isHurt: false,
      })
    } else if (isHurt) {
      set({
        inUsual: false,
        inCombat: true,
        isDying: false,
        isHurt: true,
      })
    } else if (isDying) {
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