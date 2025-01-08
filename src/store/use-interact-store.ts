import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";
import { useMonsterStore } from "./use-monster-store";
import { useCharacterStore } from "./use-character-store";
import { useEffect } from "react";

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
  // useEffect문으로 재생성 할 것
  updateActions: () => {
    const { setCharacterAction, setMonsterAction } = get();
    const characterHP = useCharacterStore.getState().characterHP;
    const monsterHP =  useMonsterStore.getState().monsterHP;
    const appearMonster = useMonsterStore.getState().appearMonster;
    const cpm = useTypingStore.getState().cpm;

    const inBattle = () => {
      const over0Hp = characterHP > 0 && monsterHP > 0;
      const showMonster = appearMonster === true;

      return over0Hp && showMonster;
    }

    const monsterDied = () => {
      const monsterDead = characterHP > 0 && monsterHP <= 0;
      const showMonster = appearMonster === true;

      // useMonsterStore.getState().setAppearMonster(false);

      return monsterDead && showMonster;
    }

    const inUsual = () => {
      const nonMonster = appearMonster === false;
      const aliveCharacter = characterHP > 0;

      return nonMonster && aliveCharacter;
    }

    // if (characterHP <= 0) {
    //   setCharacterAction("Dead");
    //   setMonsterAction("Idle");
    // }

    // if (inBattle()) {
    //   if (cpm > 150) {
    //     setCharacterAction("Attack");
    //     setMonsterAction("Hurt");
    //   } else if (cpm <= 150) {
    //     setCharacterAction("Hurt");
    //     setMonsterAction("Attack");
    //   }
    // } 

    // if (monsterDied()) {
    //   setCharacterAction("Idle");
    //   setMonsterAction("Dead");
    // }

    // if (inUsual()) {
    //   if (cpm > 150) {
    //     setCharacterAction("Run");
    //     setMonsterAction("Idle");
    //   } else if (cpm <= 150) {
    //     setCharacterAction("Walk");
    //     setMonsterAction("Idle");
    //   } else if (cpm === 0) {
    //     setCharacterAction("Idle");
    //     setMonsterAction("Idle");
    //   }
    // }
    if (characterHP <= 0) {
      setCharacterAction("Dead");
      setMonsterAction("Idle");
    } else if (inBattle()) {
      if (cpm > 150) {
        setCharacterAction("Attack");
        setMonsterAction("Hurt");
      } else if (cpm <= 150) {
        setCharacterAction("Hurt");
        setMonsterAction("Attack");
      }
    } else if (monsterDied()) {
      setCharacterAction("Idle");
      setMonsterAction("Dead");
    } else if (inUsual()) {
      if (cpm === 0) {
        setCharacterAction("Idle");
        setMonsterAction("Idle");
      } else if (cpm > 150) {
        setCharacterAction("Run");
        setMonsterAction("Idle");
      } else if (cpm <= 150) {
        setCharacterAction("Walk");
        setMonsterAction("Idle");
      }
    }
  },
}));
