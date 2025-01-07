import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";
import { useMonsterStore } from "./use-monster-store";
import { useCharacterStore } from "./use-character-store";

interface InteractStore {
  characterAction: "Idle" | "Walk" | "Run" | "Attack" | "Hurt" | "Dead" | "Skill";
  monsterAction: "Idle" | "Attack" | "Hurt" | "Dead";
  characterHp: number;
  monsterHp: number;
  setCharacterAction: (action: InteractStore["characterAction"]) => void;
  setMonsterAction: (action: InteractStore["monsterAction"]) => void;
  updateActions: () => void;
  inAction: boolean;
  setInActionToggle: () => void;
}

export const useInteractStore = create<InteractStore>((set, get) => ({
  characterAction: "Idle",
  monsterAction: "Idle",
  characterHp: 100,
  monsterHp: 100,
  setCharacterAction: (action) => set({ characterAction: action }),
  setMonsterAction: (action) => set({ monsterAction: action }),
  inAction: false,
  setInActionToggle: () => {
    const { inAction } = get();
    set({ inAction: !inAction })
  },
  updateActions: () => {
    // const cpm = useTypingStore.getState().cpm;
    const { characterAction, monsterAction, setCharacterAction, setMonsterAction, inAction } = get();
    // const characterHP = useCharacterStore.getState().characterHP;
    // const monsterHP = useMonsterStore.getState().monsterHP;
    // const appearMonster = useMonsterStore.getState().appearMonster;
    // const setMonsterNumber = useMonsterStore.getState().setMonsterNumber;
    // const monsterNumber = useMonsterStore.getState().monsterNumber;

    // 캐릭터 행동 결정 함수
    const determineCharacterAction = (): InteractStore["characterAction"] => {
      const cpm = useTypingStore.getState().cpm;
      const characterHP = useCharacterStore.getState().characterHP;
      const monsterHP =  useMonsterStore.getState().monsterHP;
      const appearMonster = useMonsterStore.getState().appearMonster;
      const { inAction, characterAction } = get();
    
      if (characterHP <= 0) return "Dead"; // 캐릭터가 사망한 경우
      
    
      if (appearMonster && monsterHP > 0 && cpm > 100 && inAction) {
        return "Attack"; // 몬스터가 출현했고, 몬스터 HP가 남아 있으며, 타이핑 속도가 조건을 만족하는 경우
      }
    
      if (appearMonster && monsterHP > 0 && cpm <= 100 && inAction) {
        return "Hurt"; // 몬스터 출현, HP가 남아 있지만 타이핑 속도가 낮은 경우
      }
    
      if (cpm > 150 && !appearMonster && !inAction) return "Run"; // 몬스터가 없고, 타이핑 속도가 높을 때
      if (cpm > 0 && !appearMonster && !inAction) return "Walk"; // 몬스터가 없고, 타이핑 중일 때
      if (monsterHP <= 0 || !appearMonster || cpm === 0) return "Idle"; // 몬스터가 없거나 활동 조건이 안 되는 경우
      return characterAction; // 기본적으로 현재 상태 유지
    };
    
    // 몬스터 행동 결정 함수
    const determineMonsterAction = (): InteractStore["monsterAction"] => {
      const cpm = useTypingStore.getState().cpm;
      const characterHP = useCharacterStore.getState().characterHP;
      const monsterHP =  useMonsterStore.getState().monsterHP;
      const appearMonster = useMonsterStore.getState().appearMonster;
      const { inAction, monsterAction } = get();
    
      if (monsterHP <= 0) return "Dead"; // 몬스터가 사망한 경우
      if (characterHP <= 0 || !appearMonster) return "Idle"; // 캐릭터가 사망하거나 몬스터가 출현하지 않은 경우
    
      if (appearMonster && monsterHP > 0 && cpm <= 100 && inAction && characterHP > 0) {
        return "Attack"; // 몬스터가 캐릭터를 공격하는 조건
      }
    
      if (appearMonster && monsterHP > 0 && cpm > 100 && inAction && characterHP > 0) {
        return "Hurt"; // 몬스터가 공격받는 조건
      }
    
      return "Idle"; // 기본적으로 Idle 상태 유지
    };

    // 캐릭터와 몬스터 상태 업데이트
    const newCharacterAction = determineCharacterAction();
    const newMonsterAction = determineMonsterAction();
    console.log("<CHA>", newCharacterAction);
    console.log("<MON>", newMonsterAction);

    setCharacterAction(newCharacterAction);
    setMonsterAction(newMonsterAction);
  },
}));
