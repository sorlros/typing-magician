import { create } from "zustand";
import { useTypingStore } from "./typing-store";
import { subscribeWithSelector } from "zustand/middleware";

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
  characterRecovery: () => void;
}

const initialState = {
  totalFrames: 7,
  frameWidth: 200,
  frameHeight: 200,
  frameDuration: 300,
  currentJob: "Fire vizard",
  characterImage: `url("/game_images/character-wizard/Fire vizard/Idle.png")`,
  characterHP: 100,
}

export const useCharacterStore = create(subscribeWithSelector<CharacterState>((set, get) => ({
  ...initialState,
  changeJob: (job) => {
    set({ currentJob: job })
  },
  resetCharacterStore : () => {
    set({
      ...initialState
    })
  },
  updateCharacterSettings: (characterAction) => {
    const typingSpeed = useTypingStore.getState().cpm;
    const currentJob = get().currentJob;
    
    let totalFrames: number;
    let frameJob: "Fire_vizard" | "Wanderer_Magican" | "Lightning_Mage" = "Fire_vizard";
    
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
      Lightning_Mage: { Idle: 7, Walk: 7, Run: 8, Hurt: 3, Dead: 5, Attack: 10, Skill: 13 },
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
      setFrameDuration = 100;
      // console.log(`Current Action: ${characterAction}, Frame Duration: ${setFrameDuration}`);
    }

    const currentState = get();

    if (currentState.characterImage.includes(`/${characterAction}.png`)) {
      return;
    }

    if (
      currentState.characterImage !==
        `url("/game_images/character-wizard/${currentJob}/${characterAction}.png")` ||
      currentState.totalFrames !== totalFrames ||
      currentState.frameDuration !== setFrameDuration
    ) {
      set({
        characterImage: `url("/game_images/character-wizard/${currentJob}/${characterAction}.png")`,
        totalFrames,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: setFrameDuration,
      });
    }
  },
  characterReduceHp: (amount) => {
    set((state) => {
      const newHp = Math.max(state.characterHP - amount, 0);
      
      // HP 0일 때만 Dead 상태 업데이트
      // if (newHp === 0 && state.characterHP !== 0) {
      //   return { 
      //     characterHP: newHp,
      //   };
      // }

      return {
        characterHP: newHp,
      }
    })
  },
  characterRecovery: () => {
    set((state) => {
      const newHp = Math.min(state.characterHP + 20, 100);

      return {
        characterHP: newHp
      }
    })
  }
})));

// useCharacterStore.subscribe(
//   (state) => state.characterHP, // hp 상태 변화 감지
//   (characterHP) => {
//     if (characterHP <= 0) {
//       console.log("캐릭터 사망: Dead 상태로 전환됩니다.");
//       useCharacterStore.getState().updateCharacterSettings("Dead");
//       // useMonsterStore.getState().updateMonsterSettings("Idle");
//     }
//   }
// );