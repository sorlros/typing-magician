import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";
import { subscribeWithSelector } from "zustand/middleware";
import { useMonsterStore } from "./use-monster-store";
import { useInteractStore } from "./use-interact-store";

type CharacterAction = "Idle" | "Walk" | "Run" | "Hurt" | "Dead" | "Attack" | "Skill";

interface CharacterState {
  totalFrames: number; // 스프라이트 시트에 있는 총 프레임 수
  frameWidth: number; // 각 프레임의 너비 (px)
  frameHeight: number; // 각 프레임의 높이 (px)
  frameDuration: number;
  characterImage: string;
  currentJob: string;
  changeJob: (job: string) => void;
  characterHP: number;
  updateCharacterSettings: (actionValue: CharacterAction) => void;
  characterReduceHp: (amount: number) => void;
}

export const useCharacterStore = create(subscribeWithSelector<CharacterState>((set, get) => ({
  totalFrames: 7,
  frameWidth: 200,
  frameHeight: 200,
  frameDuration: 300,
  currentJob: "Fire vizard",
  characterImage: `url("/game_images/character-wizard/Fire vizard/Idle.png")`,
  characterHP: 100,
  changeJob: (job) => {
    set({ currentJob: job })
  },
  updateCharacterSettings: (characterAction) => {
    const typingSpeed = useTypingStore.getState().cpm;
    const currentJob = get().currentJob;
    const appearMonster = useMonsterStore.getState().appearMonster;
    // const { characterAction } = useInteractStore.getState();
    const monsterAction = useInteractStore.getState().monsterAction;
    const monsterHP = useMonsterStore.getState().monsterHP;
    
    let totalFrames: number;
    // let action: "Idle" | "Walk" | "Run" | "Hurt" | "Dead" | "Attack" | "Skill" = "Idle";
    let frameJob: "Fire_vizard" | "Wanderer_Magican" | "Lightning_Mage" = "Fire_vizard";

    // 캐릭터 행동 변수 정의
    // if (monsterAction === "Dead") {
    //   action = "Idle";
    // } else {
    //   switch (characterAction) {
    //     case "Dead":
    //       action = "Dead";
    //       break;

    //     case "Hurt":
    //       action = "Hurt";
    //       break;

    //     case "Attack":
    //       action = "Attack";
    //       break;

    //     case "Skill":
    //       action = "Skill";
    //       break;

    //     case "Idle":
    //       if (typingSpeed > 150 && !appearMonster) {
    //         action = "Run";
    //       } else if (typingSpeed > 0 && !appearMonster) {
    //         action = "Walk";
    //       } else if (typingSpeed === 0 || appearMonster || monsterHP === 0) {
    //         action = "Idle";
    //       }
    //       break;

    //     default:
    //       // 예상치 못한 상태에 대한 기본값 설정
    //       console.warn(`예상하지못한 상태: ${characterAction}`);
    //       action = "Idle";
    //   }
    // }
    
    if (currentJob === "Fire vizard") {
      frameJob = "Fire_vizard"
    } else if (currentJob === "Wanderer Magican") {
      frameJob = "Wanderer_Magican"
    } else if (currentJob === "Lightning Mage") {
      frameJob = "Lightning_Mage"
    } else {
      frameJob = "Fire_vizard"
    }

    const framesMap = {
      Fire_vizard: { Idle: 7, Walk: 6, Run: 8, Hurt: 3, Dead: 6, Attack: 4, Skill: 14 },
      Wanderer_Magican: { Idle: 8, Walk: 7, Run: 8, Hurt: 4, Dead: 4, Attack: 7, Skill: 16 },
      Lightning_Mage: { Idle: 7, Walk: 7, Run: 8, Hurt: 3, Dead: 5, Attack: 10, Skill: 12 },
    };
  
    // totalFrames = framesMap[frameJob][characterAction]

    totalFrames = framesMap[frameJob][characterAction];

    let setFrameDuration;

    // frameDuration 설정
    if (characterAction === "Dead") {
      setFrameDuration = 300;
    } else if (characterAction === "Hurt") {
      setFrameDuration = 200;
    } else if (characterAction === "Attack") {
      setFrameDuration = Math.max(100, Math.min(10000 / typingSpeed, 1000));
    } else if (characterAction === "Run") {
      setFrameDuration = 100;
    } else if (characterAction === "Walk") {
      setFrameDuration = 200;
    } else if (characterAction === "Idle") {
      setFrameDuration = 300;
    } else if (characterAction === "Skill") {
      setFrameDuration = 600;
    }

    set({
      characterImage: `url("game_images/character-wizard/${currentJob}/${characterAction}.png")`,
      totalFrames,
      frameWidth: 200,
      frameHeight: 200,
      frameDuration: setFrameDuration,
    });
  },
  characterReduceHp: (amount) => {
    set((state) => {
      const newHp = Math.max(state.characterHP - amount, 0);

      return {
        characterHP: newHp,
      }
    })
  }
})));

useCharacterStore.subscribe(
  (state) => state.characterHP, // hp 상태 변화 감지
  (characterHP) => {
    if (characterHP <= 0) {
      console.log("캐릭터 사망: Dead 상태로 전환됩니다.");
      useCharacterStore.getState().updateCharacterSettings("Dead");
      // useMonsterStore.getState().updateMonsterSettings("Idle");
    }
  }
);