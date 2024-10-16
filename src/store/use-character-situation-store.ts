import { create } from "zustand";

interface SituationStore {
  inUsual: boolean;
  inCombat: boolean;
  isDying: boolean;
  isHurt: boolean;
  setCharacterSituations: (value: string) => void;
}

const useCharacterSituationStore = create<SituationStore>((set, get) => ({
  inUsual: true,
  inCombat: false,
  isDying: false,
  isHurt: false,
  setCharacterSituations: (value) => {
    if (value === "inUsual") {
      set({
        inUsual: true,
        inCombat: false,
        isDying: false,
        isHurt: false,
      })
      // inCombat시 출혈상태 설정 로직 구상, 추가변수로 프레임의 값을 받아오는 것을 고려
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

export default useCharacterSituationStore;